import { Pool } from '@/services/pool/types';
import {
  BalancerRelayer__factory,
  BalancerSDK,
  Relayer,
  SimulationType,
} from '@symmetric-v3/sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Ref } from 'vue';
import { JoinParams, JoinPoolHandler, QueryOutput } from './join-pool.handler';
import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import { bnum, isSameAddress, selectByAddress } from '@/lib/utils';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { configService } from '@/services/config/config.service';
import { AddressZero } from '@ethersproject/constants';
import { convertERC4626Wrap } from '@/lib/utils/balancer/erc4626Wrappers';
import { BigNumber } from '@ethersproject/bignumber';

type JoinResponse = Awaited<
  ReturnType<BalancerSDK['pools']['generalisedJoin']>
>;

const balancerRelayerInterface = BalancerRelayer__factory.createInterface();

/**
 * Handles generalized joins for deep pools using SDK functions.
 */
export class YaJoinHandler implements JoinPoolHandler {
  private lastJoinRes?: JoinResponse;

  constructor(
    public readonly pool: Ref<Pool>,
    public readonly sdk: BalancerSDK
  ) {}

  async join(params: JoinParams): Promise<TransactionResponse> {
    params.isJoin = true;
    await this.queryJoin(params);

    if (!this.lastJoinRes) {
      throw new Error('Could not query generalised join');
    }

    const txBuilder = new TransactionBuilder(params.signer);
    const { to, encodedCall, value } = this.lastJoinRes;

    return txBuilder.raw.sendTransaction({ to, data: encodedCall, value });
  }

  async queryJoin({
    amountsIn,
    tokensIn,
    signer,
    slippageBsp,
    relayerSignature,
  }: JoinParams): Promise<QueryOutput> {
    console.log('relayerSignature', relayerSignature);

    const evmAmountsIn: string[] = [];
    const tokenAddresses: string[] = [];
    const wrapperAmountsIn: { wrapper: string; amount: BigNumber }[] = [];
    const signerAddress = await signer.getAddress();

    for (const { address, value } of amountsIn) {
      const token = selectByAddress(tokensIn, address);

      if (!token || !token.decimals) {
        throw new Error(`Token metadata missing for: ${address}`);
      }
      const underlying = this.formatTokenAddress(address);
      const wrapper =
        configService.network.tokens.Addresses.yaPools?.[this.pool.value.id]
          .underlyingWrapperMap[underlying];

      if (!wrapper) {
        throw new Error(`Wrapper not found for token: ${address}`);
      }

      tokenAddresses.push(address, this.formatTokenAddress(wrapper));

      const parsedValue = parseFixed(value || '0', token.decimals);
      const underlyingAmount = parsedValue.mul(20).div(100);
      const eightyPercent = parsedValue.mul(80).div(100);

      const wAmount = await convertERC4626Wrap(wrapper, {
        amount: eightyPercent,
        isWrap: true,
      });

      let wrapperAmount = wAmount;
      if (token.decimals === 18) {
        const buffer = eightyPercent.mul(2).div(100000000);
        console.log('buffer', buffer.toString());
        wrapperAmount = wrapperAmount.sub(buffer);
      }

      console.log('wrapperAmount', wrapperAmount.toString());
      wrapperAmountsIn.push({ wrapper: wrapper, amount: eightyPercent });

      evmAmountsIn.push(underlyingAmount.toString(), wrapperAmount.toString());
    }

    const slippage = slippageBsp.toString();
    const poolId = this.pool.value.id;

    this.lastJoinRes = await this.sdk.pools.generalisedJoin(
      poolId,
      tokenAddresses,
      evmAmountsIn,
      signerAddress,
      slippage,
      signer,
      SimulationType.VaultModel,
      relayerSignature
    );
    console.log('lastJoinRes', this.lastJoinRes);

    if (!this.lastJoinRes) {
      throw new Error('Failed to fetch expected output.');
    }

    const wrapCalls = wrapperAmountsIn.map(({ wrapper, amount }, i) => {
      return Relayer.encodeWrapErc4626({
        wrappedToken: wrapper,
        sender: signerAddress,
        recipient: signerAddress,
        amount,
        outputReference: i,
      });
    });

    console.log(wrapperAmountsIn);

    if (relayerSignature) {
      this.lastJoinRes.encodedCalls.splice(1, 0, ...wrapCalls);
    } else {
      this.lastJoinRes.encodedCalls.unshift(...wrapCalls);
    }
    this.lastJoinRes.encodedCall = balancerRelayerInterface.encodeFunctionData(
      'multicall',
      [this.lastJoinRes.encodedCalls]
    );

    console.log('encodedCalls', this.lastJoinRes?.encodedCalls);

    const bptOut = formatFixed(
      this.lastJoinRes.expectedOut,
      this.pool.value.onchain?.decimals || 18
    );
    const priceImpact: number = bnum(
      formatFixed(this.lastJoinRes.priceImpact, 18)
    ).toNumber();

    if (bnum(bptOut).eq(0)) throw new Error('Not enough liquidity.');

    return {
      bptOut,
      priceImpact,
    };
  }

  // private getSimulationType({
  //   isNativeAssetJoin,
  //   hasInvalidAmounts,
  //   approvalActionsLength,
  // }:
  //   isNativeAssetJoin: boolean;
  //   hasInvalidAmounts: boolean;
  //   approvalActionsLength: number;
  // }): SimulationType {
  //   if (isNativeAssetJoin) {
  //     return SimulationType.VaultModel;
  //   }
  //   // if (!hasInvalidAmounts && !approvalActionsLength) {
  //   //   return SimulationType.Static;
  //   // }
  //   return SimulationType.VaultModel;
  // }

  /**
   * If native asset addres, replaces with zero address because the vault only checks
   * for the zero address when joining with native asset.
   */
  private formatTokenAddress(address: string): string {
    const { nativeAsset } = configService.network.tokens.Addresses;

    if (isSameAddress(address, nativeAsset)) {
      return AddressZero;
    }

    return address;
  }
}
