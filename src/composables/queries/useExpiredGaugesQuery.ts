import { getAddress } from '@ethersproject/address';
import { computed, reactive, Ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { LiquidityGauge } from '@/services/balancer/contracts/contracts/liquidity-gauge';
import { Address } from '@/types';

import useNetwork from '../useNetwork';

/**
 * TYPES
 */
type QueryResponse = Readonly<Address[]>;
type MulticallerResult = Record<Address, { isKilled: boolean }>;
type QueryOptions = UseQueryOptions<QueryResponse>;

function callGaugesIsKilledStatus(
  gaugeAddresses: Address[]
): Promise<MulticallerResult> {
  const multicaller = LiquidityGauge.getMulticaller();

  for (const gaugeAddress of gaugeAddresses) {
    multicaller.call(
      `${getAddress(gaugeAddress)}.isKilled`,
      getAddress(gaugeAddress),
      'is_killed'
    );
  }
  return multicaller.execute<MulticallerResult>();
}

/**
 * @summary Given a list of gauge addresses, fetches their is_killed status onchain
 * and returns the addresses that have is_killed status.
 */
export default function useExpiredGaugesQuery(
  gaugeAddresses: Ref<Address[] | undefined>,
  options: QueryOptions = {}
) {
  /**
   * COMPOSABLES
   */
  const { networkId } = useNetwork();

  /**
   * COMPUTED
   */
  const isQueryEnabled = computed(() => {
    return !!gaugeAddresses.value?.length;
  });

  /**
   * QUERY KEY
   */
  const queryKey = reactive(
    QUERY_KEYS.Gauges.Expired(gaugeAddresses, networkId)
  );

  /**
   * QUERY FUNCTION
   */
  async function queryFn() {
    const expiredGaugeAddresses: Address[] = [];
    if (gaugeAddresses.value?.length) {
      const gaugesExpiredStatus = await callGaugesIsKilledStatus(
        gaugeAddresses.value
      ).catch(error => {
        console.error('Error when fetching voting gauges is_killed status', {
          error,
        });
        return [];
      });

      for (const [address, value] of Object.entries(gaugesExpiredStatus)) {
        if (value.isKilled) {
          expiredGaugeAddresses.push(address);
        }
      }
    }
    return Object.freeze(
      expiredGaugeAddresses.map(address => address.toLowerCase())
    );
  }

  /**
   * QUERY OPTIONS
   */
  const queryOptions = reactive({
    enabled: isQueryEnabled,
    ...options,
  });
  return useQuery<QueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
