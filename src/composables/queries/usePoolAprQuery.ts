import { computed, reactive } from 'vue';
import { useQuery, QueryObserverOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { poolsStoreService } from '@/services/pool/pools-store.service';
import { Pool } from '@/services/pool/types';

import useNetwork from '../useNetwork';
import usePoolQuery from './usePoolQuery';
import { AprBreakdown } from '@symmetric-v3/sdk';
import { getBalancerSDK } from '@/dependencies/balancer-sdk';

type QueryOptions = QueryObserverOptions<AprBreakdown>;

export default function usePoolAprQuery(
  id: string,
  options: QueryObserverOptions<AprBreakdown> = {}
) {
  /**
   * @description
   * If pool is already downloaded, we can use it instantly
   * it may be if user came to pool page from home page
   */
  const storedPool = poolsStoreService.findPool(id);

  /**
   * COMPOSABLES
   */
  const poolQuery = usePoolQuery(id);

  /**
   * QUERY DEPENDENCIES
   */
  const { networkId } = useNetwork();

  /**
   * COMPUTED
   */
  const pool = computed(() => poolQuery.data.value);
  const enabled = computed(() => !!pool.value?.id || !!storedPool);

  // const rewardAprs = async (
  //   pool: Pool
  // ): Promise<AprBreakdown['rewardAprs']> => {
  //   if (!this.liquidityGauges) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   // Data resolving
  //   const gauge = await this.liquidityGauges.findBy('poolId', pool.id);
  //   if (
  //     !gauge ||
  //     !gauge.rewardTokens ||
  //     Object.keys(gauge.rewardTokens).length < 1
  //   ) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   // BAL rewards already returned as stakingApr, so we can filter them out
  //   const bal =
  //     BALANCER_NETWORK_CONFIG[pool.chainId as Network].addresses.tokens.bal;
  //   const rewardTokenAddresses = Object.keys(gauge.rewardTokens).filter(
  //     a => a != bal
  //   );

  //   // Gets each tokens rate, extrapolate to a year and convert to USD
  //   const rewards = rewardTokenAddresses.map(async tAddress => {
  //     /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  //     const data = gauge!.rewardTokens![tAddress];
  //     return rewardTokenApr(tAddress, data);
  //   });
  //   // Get the gauge totalSupplyUsd
  //   const bptPriceUsd = await this.bptPrice(pool);
  //   const totalSupplyUsd = gauge.totalSupply * bptPriceUsd;

  //   if (totalSupplyUsd == 0) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   const rewardTokensBreakdown: Record<string, number> = {};

  //   let total = 0;
  //   for await (const reward of Object.values(rewards)) {
  //     const rewardValue = reward.value / totalSupplyUsd;
  //     const rewardValueScaled = Math.round(10000 * rewardValue);
  //     total += rewardValueScaled;
  //     rewardTokensBreakdown[reward.address] = rewardValueScaled;
  //   }

  //   return {
  //     total,
  //     breakdown: rewardTokensBreakdown,
  //   };
  // };

  // const rewardTokenApr = async (
  //   tokenAddress: string,
  //   rewardData: { rate: BigNumber; period_finish: BigNumber; decimals?: number }
  // ) => {
  //   if (rewardData.period_finish.toNumber() < Date.now() / 1000) {
  //     return {
  //       address: tokenAddress,
  //       value: 0,
  //     };
  //   } else {
  //     const yearlyReward = rewardData.rate.mul(86400).mul(365);
  //     const price = await this.tokenPrices.find(tokenAddress);
  //     if (price && price.usd) {
  //       let decimals = 18;
  //       if (rewardData.decimals) {
  //         decimals = rewardData.decimals;
  //       } else {
  //         const meta = await this.tokenMeta.find(tokenAddress);
  //         decimals = meta?.decimals || 18;
  //       }
  //       const yearlyRewardUsd =
  //         parseFloat(formatUnits(yearlyReward, decimals)) *
  //         parseFloat(price.usd);
  //       return {
  //         address: tokenAddress,
  //         value: yearlyRewardUsd,
  //       };
  //     } else {
  //       console.error(`No USD price for ${tokenAddress}`);
  //     }
  //   }
  // };

  /**
   * QUERY INPUTS
   */
  const queryKey = QUERY_KEYS.Pools.APR(networkId, id);

  const queryFn = async (): Promise<AprBreakdown> => {
    let _pool: Pool;
    if (storedPool) {
      _pool = storedPool;
    } else if (pool.value) {
      // copy computed pool to avoid mutation warnings
      _pool = { ...pool.value, tokens: [...pool.value.tokens] };
    } else {
      throw new Error('No pool');
    }

    if (_pool?.apr) {
      return _pool.apr;
    }

    _pool.chainId = networkId.value;

    const apr = await getBalancerSDK().pools.apr(_pool);
    // has local rewards

    return apr;
  };
  const queryOptions = reactive({
    enabled,
    ...options,
  });
  return useQuery<AprBreakdown>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
