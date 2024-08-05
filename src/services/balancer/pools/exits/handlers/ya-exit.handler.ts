import { Pool } from '@/services/pool/types';
import {
  BalancerRelayer__factory,
  BalancerSDK,
  Relayer,
  SimulationType,
} from '@symmetric-v3/sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import {
  ExitParams,
  ExitPoolHandler,
  QueryOutput,
  AmountsOut,
} from './exit-pool.handler';
import { getBalancerSDK } from '@/dependencies/balancer-sdk';
import { BigNumber, formatFixed, parseFixed } from '@ethersproject/bignumber';
import { bnum, isSameAddress } from '@/lib/utils';
import { flatTokenTree } from '@/composables/usePoolHelpers';
import { getAddress } from '@ethersproject/address';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { configService } from '@/services/config/config.service';
import { convertERC4626Wrap } from '@/lib/utils/balancer/erc4626Wrappers';

type BalancerSdkType = ReturnType<typeof getBalancerSDK>;
export type ExitResponse = Awaited<
  ReturnType<BalancerSdkType['pools']['generalisedExit']>
>;
export type ExitInfo = Awaited<
  ReturnType<BalancerSdkType['pools']['getExitInfo']>
>;

const balancerRelayerInterface = BalancerRelayer__factory.createInterface();

/**
 * Handles exits using SDK's generalisedExit function.
 */
export class YaExitHandler implements ExitPoolHandler {
  private exitTx?: ExitResponse;
  private exitInfo?: ExitInfo;

  constructor(
    public readonly pool: Ref<Pool>,
    public readonly sdk: BalancerSDK
  ) {}

  async exit(params: ExitParams): Promise<TransactionResponse> {
    await this.queryExit(params);

    if (!this.exitTx) {
      throw new Error('Could not query generalised exit');
    }

    const txBuilder = new TransactionBuilder(params.signer);
    const { to, encodedCall } = this.exitTx;

    return txBuilder.raw.sendTransaction({ to, data: encodedCall });
  }

  async queryExit({
    bptIn,
    signer,
    slippageBsp,
    relayerSignature,
    approvalActions,
    bptInValid,
  }: ExitParams): Promise<QueryOutput> {
    const evmAmountIn = parseFixed(
      bptIn || '0',
      this.pool.value.onchain?.decimals ?? 18
    );
    if (evmAmountIn.lte(0)) throw new Error('BPT in amount is 0.');

    const signerAddress = await signer.getAddress();
    const slippage = slippageBsp.toString();
    const isRelayerApproved =
      (bptInValid && approvalActions.length === 0) || !!relayerSignature;
    const balancer = getBalancerSDK();

    const yaPools =
      configService.network.tokens.Addresses.yaPools?.[this.pool.value.id];
    const underlyingWrapperMap = yaPools?.wrapperUnderlyingMap || {};

    const aggregatedAmounts: { [address: string]: BigNumber } = {};
    const wrapperAmounts: { wrapper: string; amount: BigNumber }[] = [];

    try {
      if (this.exitInfo && isRelayerApproved) {
        this.exitTx = await balancer.pools.generalisedExit(
          this.pool.value.id,
          evmAmountIn.toString(),
          signerAddress,
          slippage,
          signer,
          SimulationType.Static,
          relayerSignature,
          this.exitInfo.tokensToUnwrap
        );
      } else {
        this.exitInfo = await balancer.pools.getExitInfo(
          this.pool.value.id,
          evmAmountIn.toString(),
          signerAddress,
          signer
        );
      }
    } catch (error) {
      console.error(error);
      console.log('Failed here');
      throw new Error('Failed to query exit.');
    }

    if (!this.exitInfo && !this.exitTx)
      throw new Error('Failed to query exit.');

    console.log('exitInfo', this.exitInfo);

    const tokensOut = this.exitTx?.tokensOut || this.exitInfo.tokensOut;
    const estimatedAmountsOut =
      this.exitTx?.expectedAmountsOut || this.exitInfo.estimatedAmountsOut;

    // Iterate over tokensOut and estimatedAmountsOut
    for (let i = 0; i < tokensOut.length; i++) {
      const token = tokensOut[i];
      const amount = BigNumber.from(estimatedAmountsOut[i]);

      // Check if the token is a wrapper
      const underlyingToken = underlyingWrapperMap[token];

      if (underlyingToken) {
        wrapperAmounts.push({ wrapper: token, amount });

        const unwrapAmount = await convertERC4626Wrap(token, {
          amount,
          isWrap: false,
        });
        // If it's a wrapper, add the amount to the underlying token's amount
        if (!aggregatedAmounts[underlyingToken]) {
          aggregatedAmounts[underlyingToken] = BigNumber.from(0);
        }
        aggregatedAmounts[underlyingToken] =
          aggregatedAmounts[underlyingToken].add(unwrapAmount);
      } else {
        // If it's not a wrapper, add the amount directly
        if (!aggregatedAmounts[token]) {
          aggregatedAmounts[token] = BigNumber.from(0);
        }
        aggregatedAmounts[token] = aggregatedAmounts[token].add(amount);
      }
    }

    // Update exitInfo with aggregated results
    if (this.exitTx) {
      this.exitInfo.tokensOut = Object.keys(aggregatedAmounts);
      this.exitTx.expectedAmountsOut = Object.values(aggregatedAmounts).map(
        amount => amount.toString()
      );
      const unwrapCalls = wrapperAmounts.map(({ wrapper, amount }) => {
        return Relayer.encodeUnwrapErc4626({
          wrappedToken: wrapper,
          sender: signerAddress,
          recipient: signerAddress,
          amount,
          outputReference: 0,
        });
      });
      this.exitTx.encodedCalls.push(...unwrapCalls);
      this.exitTx.encodedCall = balancerRelayerInterface.encodeFunctionData(
        'multicall',
        [this.exitTx.encodedCalls]
      );
    } else {
      this.exitInfo.tokensOut = Object.keys(aggregatedAmounts);
      this.exitInfo.estimatedAmountsOut = Object.values(aggregatedAmounts).map(
        amount => amount.toString()
      );
    }

    const priceImpact: number = bnum(
      formatFixed(this.exitTx?.priceImpact || this.exitInfo.priceImpact, 18)
    ).toNumber();

    return {
      priceImpact,
      amountsOut: this.formatAmountsOut(
        this.exitTx?.expectedAmountsOut || this.exitInfo.estimatedAmountsOut,
        this.exitTx?.tokensOut || this.exitInfo.tokensOut
      ),
      txReady: !!this.exitTx,
    };
  }

  /**
   * PRIVATE METHODS
   */
  private formatAmountsOut(
    expectedAmountsOut: string[],
    tokensOut: string[]
  ): AmountsOut {
    const amountsOut: AmountsOut = {};
    const allPoolTokens = flatTokenTree(this.pool.value);

    expectedAmountsOut.forEach((amount, i) => {
      const token = allPoolTokens.find(poolToken =>
        isSameAddress(poolToken.address, tokensOut[i])
      );

      if (token) {
        const realAddress = getAddress(token.address);
        const scaledAmount = formatFixed(
          amount,
          token.decimals ?? 18
        ).toString();
        amountsOut[realAddress] = scaledAmount;
      }
    });

    return amountsOut;
  }
}
