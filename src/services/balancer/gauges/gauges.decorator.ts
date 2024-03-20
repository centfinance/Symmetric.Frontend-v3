import { AddressZero } from '@ethersproject/constants';
import { configService } from '@/services/config/config.service';

import {
  Gauge,
  OnchainGaugeData,
  OnchainGaugeDataMap,
  SubgraphGauge,
} from './types';
import { getMulticaller } from '@/dependencies/Multicaller';
import { Multicaller } from '@/services/multicalls/multicaller';

const MAX_REWARD_TOKENS = 3;

export class GaugesDecorator {
  multicaller: Multicaller;

  constructor() {
    const multicaller = getMulticaller();
    this.multicaller = new multicaller();
  }

  /**
   * @summary Combine subgraph gauge schema with onchain data using multicalls.
   */
  async decorate(
    subgraphGauges: SubgraphGauge[],
    userAddress: string
  ): Promise<Gauge[]> {
    this.callRewardTokens(subgraphGauges);
    this.callClaimableTokens(subgraphGauges, userAddress);
    let gaugesDataMap = await this.multicaller.execute<OnchainGaugeDataMap>();

    const nativeGauges = subgraphGauges.filter(gauge => !gauge.streamer);
    this.callClaimableRewards(nativeGauges, userAddress, gaugesDataMap, false);
    // const oldL2Gauges = subgraphGauges.filter(gauge => !!gauge.streamer);
    //this.callClaimableRewards(oldL2Gauges, userAddress, gaugesDataMap, true);

    gaugesDataMap = await this.multicaller.execute<OnchainGaugeDataMap>(
      gaugesDataMap
    );
    return subgraphGauges.map(subgraphGauge => ({
      ...subgraphGauge,
      ...this.format(gaugesDataMap[subgraphGauge.id]),
    }));
  }

  /**
   * @summary Format raw onchain data fetched from multicalls.
   */
  private format(gaugeData: OnchainGaugeData): OnchainGaugeData {
    if (!gaugeData) {
      return {
        rewardTokens: [],
        claimableTokens: '0',
        claimableRewards: { 1: '', 2: '' },
      };
    }
    return {
      ...gaugeData,
      rewardTokens: this.formatRewardTokens(gaugeData.rewardTokens),
      claimableTokens: gaugeData.claimableTokens?.toString() || '0',
      claimableRewards: this.formatClaimableRewards(gaugeData.claimableRewards),
    };
  }

  /**
   * @summary Add multicaller calls that fetch list of reward token addresses for each gauge
   * in given array of gauges.
   */
  private callRewardTokens(subgraphGauges: SubgraphGauge[]) {
    subgraphGauges.forEach(gauge => {
      if (gauge.isPreferentialGauge) {
        if (
          // gauge.symbol == '70TSOUL-30tSYMM-gauge' ||
          gauge.symbol == '50TKIND-50TSOUL-gauge'
        )
          return;
        for (let i = 0; i < MAX_REWARD_TOKENS; i++) {
          this.multicaller.call({
            key: `${gauge.id}.rewardTokens[${i}]`,
            address: gauge.id,
            abi: ['function reward_tokens(uint256) view returns (address)'],
            function: 'reward_tokens',
            params: [i],
          });
        }
      }
    });
  }

  /**
   * @summary Filter out zero addresses from reward tokens array.
   * @description There can be up to 8 reward tokens for a gauge.
   * The onchain call for reward tokens returns an array of length 8
   * with each position filled with the zero address if a reward token
   * has not been added.
   */
  private formatRewardTokens(rewardTokens: string[]): string[] {
    if (!rewardTokens) return [];
    return rewardTokens.filter(token => token !== AddressZero);
  }

  /**
   * @summary Add multicaller calls that fetch the user's claimable BAL
   * for each gauge in given array of gauges.
   */
  private callClaimableTokens(
    subgraphGauges: SubgraphGauge[],
    userAddress: string
  ) {
    subgraphGauges.forEach(gauge => {
      if (gauge.isPreferentialGauge) {
        if (
          // gauge.symbol == '70TSOUL-30tSYMM-gauge' ||
          // gauge.symbol == '50TKIND-50TSOUL-gauge' ||
          gauge.symbol == '69Trump-31WTLOS-gauge' ||
          gauge.symbol == '69CMDR-31WTLOS-gauge' ||
          gauge.symbol == '80MST-20USDM-gauge'
        ) {
          return;
        }

        const call = this.multicaller.call({
          key: `${gauge.id}.claimableTokens`,
          address: gauge.id,
          function: 'claimable_tokens',
          abi: ['function claimable_tokens(address) view returns (uint256)'],
          params: [userAddress],
        });
        return call;
      }
    });
  }

  /**
   * @summary Add multicaller calls that fetch the claimable amounts for reward tokens,
   * e.g. non BAL rewards on gauge.
   */
  private callClaimableRewards(
    subgraphGauges: SubgraphGauge[],
    userAddress: string,
    gaugesDataMap: OnchainGaugeDataMap,
    shouldUseRewardHelper: boolean
  ) {
    const methodName = shouldUseRewardHelper
      ? 'getPendingRewards'
      : 'claimable_reward';

    subgraphGauges.forEach(gauge => {
      if (!gaugesDataMap[gauge.id] || !gaugesDataMap[gauge.id].rewardTokens)
        return;

      gaugesDataMap[gauge.id].rewardTokens.forEach(rewardToken => {
        console.log('called');
        if (rewardToken === AddressZero) return;

        const params = shouldUseRewardHelper
          ? [gauge.id, userAddress, rewardToken]
          : [userAddress, rewardToken];

        const contractAddress =
          shouldUseRewardHelper &&
          configService.network.addresses.gaugeRewardsHelper
            ? configService.network.addresses.gaugeRewardsHelper
            : gauge.id;

        const abi = shouldUseRewardHelper
          ? [
              'function getPendingRewards(address,address,address) view returns (uint256)',
            ]
          : [
              'function claimable_reward(address,address) view returns (uint256)',
            ];
        this.multicaller.call({
          key: `${gauge.id}.claimableRewards.${rewardToken}`,
          address: contractAddress,
          function: methodName,
          abi,
          params,
        });
      });
    });
  }

  /**
   * @summary converts claimable reward values in map to strings from BigNumbers.
   */
  private formatClaimableRewards(
    claimableRewards: Record<string, string>
  ): Record<string, string> {
    if (!claimableRewards) return {};

    Object.keys(claimableRewards).forEach(rewardToken => {
      if (!claimableRewards[rewardToken]) {
        claimableRewards[rewardToken] = '0';
      }
      claimableRewards[rewardToken] = claimableRewards[rewardToken].toString();
    });

    return claimableRewards;
  }
}

export const gaugesDecorator = new GaugesDecorator();
