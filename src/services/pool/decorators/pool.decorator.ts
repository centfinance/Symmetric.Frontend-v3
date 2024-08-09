// import { getTimeTravelBlock } from '@/composables/useSnapshots';
import { getTimeTravelBlock } from '@/composables/useSnapshots';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';
import PoolService from '../pool.service';
import { PoolMulticaller } from './pool.multicaller';
import axios from 'axios';
import { configService } from '@/services/config/config.service';
import { rewardSymbol } from '@/composables/useNetwork';
import { subgraphFallbackService } from '@/services/balancer/subgraph/subgraph-fallback.service';

/**
 * @summary Decorates a set of pools with additonal data.
 */
export class PoolDecorator {
  constructor(
    public pools: Pool[],
    private readonly poolServiceClass = PoolService,
    private readonly poolSubgraph = balancerSubgraphService
  ) {}

  public async decorate(
    tokens: TokenInfoMap,
    fullDecoration = true
  ): Promise<Pool[]> {
    if (
      configService.network.chainId === 40 ||
      configService.network.chainId === 82
    ) {
      const rewardData: any = localStorage.getItem('REWARD_PRICE');
      if (rewardData) {
        const data = JSON.parse(rewardData);
        console.log(
          isPriceOutdated(data.timestamp),
          !data[`${rewardSymbol}_price`]
        );
        if (isPriceOutdated(data.timestamp) || !data[`${rewardSymbol}_price`]) {
          setRewardPriceInLocalStorage()
            .then(() => {
              console.log('REWARD_PRICE has been updated in local storage');
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      } else {
        setRewardPriceInLocalStorage()
          .then(() => {
            console.log('REWARD_PRICE has been set in local storage');
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }
    const processedPools = this.pools.map(pool => {
      const poolService = new this.poolServiceClass(pool);
      return poolService.pool;
    });

    const poolMulticaller = new PoolMulticaller(processedPools);

    const [poolSnapshots, rawOnchainDataMap] = await Promise.all([
      fullDecoration ? this.getSnapshots() : [],
      poolMulticaller.fetch(),
    ]);

    let rewards;
    if (configService.network.chainId === 40) {
      const request = await fetch(
        'https://rewards.symmetric.workers.dev/rewards/telos'
      );
      rewards = await request.json();
    }
    console.log(rewards);
    const promises = processedPools.map(async pool => {
      const poolService = new this.poolServiceClass(pool);

      poolService.setOnchainData(rawOnchainDataMap[pool.id], tokens);

      // All of the following are pre-cached by the Balancer API so we can skip
      // decoration of them if the pool came from the API.
      if (fullDecoration) {
        const poolSnapshot = poolSnapshots.find(p => p.id === pool.id);
        poolService.setFeesSnapshot(poolSnapshot);
        poolService.setVolumeSnapshot(poolSnapshot);
        await poolService.setTotalLiquidity();

        rewards
          ? await poolService.setAPR(rewards)
          : await poolService.setAPR();
      }

      return poolService.pool;
    });

    return await Promise.all(promises);
  }

  /**
   * Re-sets totalLiquidty on all pools, typically after prices have been updated.
   */
  public async reCalculateTotalLiquidities(): Promise<Pool[]> {
    return Promise.all(
      this.pools.map(async pool => {
        const poolService = new this.poolServiceClass(pool);
        await poolService.setTotalLiquidity();
        return poolService.pool;
      })
    );
  }

  /**
   * @summary Get snapshot data of pools
   * @description Getting the past state of pools allows us to calculate
   * snapshot values like volume and fees, currently fixed at past 24h
   * (see getTimeTravelBlock).
   */
  private async getSnapshots(): Promise<Pool[]> {
    const blockNumber = await getTimeTravelBlock();
    console.log(blockNumber);
    const block = { number: blockNumber };
    const isInPoolIds = { id: { in: this.pools.map(pool => pool.id) } };
    try {
      return await this.poolSubgraph.pools.get({
        where: isInPoolIds,
        block,
      });
    } catch (error) {
      try {
        const subgraphBlock = (await subgraphFallbackService.get({
          query: '{ _meta { block { number } } }',
        })) as any;
        return await this.poolSubgraph.pools.get({
          where: isInPoolIds,
          block: { number: subgraphBlock.data.data._meta.block.number },
        });
      } catch (error) {
        console.error('Failed to fetch pool snapshots', error);
        return [];
      }
    }
  }
}

// const getMTRG_wstMTRGPrice = async (): Promise<number> => {
//   // try {
//   //   const response = await axios.get(
//   //     'https://symm-prices.symmetric.workers.dev/prices/0x2077a828fd58025655335a8756dbcfeb7e5bec46'
//   //   );
//   //   const price = response.data[0].price;
//   //   return price;
//   // } catch (error) {
//   //   console.error(error);
//   //   throw error;
//   // }
//   try {
//     const response = await axios.get(
//       'https://api.coingecko.com/api/v3/simple/token_price/meter?contract_addresses=0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3&vs_currencies=usd'
//     );
//     console.log(response.data);
//     const price =
//       response.data['0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3'].usd;
//     return price;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
//};

const getTelosRewardPrices = async (): Promise<any> => {
  const rewards = [
    {
      symbol: 'USDM',
      address: '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
      network: 'telos',
    },
    {
      symbol: 'WTLOS',
      address: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
      network: 'telos',
    },
  ];
  const rewardAddresses = rewards.map(reward => reward.address.toLowerCase());
  const rewardAddressesString = rewardAddresses.join(',');
  try {
    const response = await axios.get(
      `https://symm-prices.symmetric.workers.dev/telos/prices/${rewardAddressesString}`
    );
    return {
      USDM_price: response.data[0].price,
      WTLOS_price: response.data[1].price,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setRewardPriceInLocalStorage = async (): Promise<void> => {
  try {
    const { USDM_price, WTLOS_price } = await getTelosRewardPrices();
    // const MTRG_wstMTRG_price = await getMTRG_wstMTRGPrice();
    const timestamp = Date.now();
    const data = { USDM_price, WTLOS_price, timestamp };
    localStorage.setItem('REWARD_PRICE', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const isPriceOutdated = (timestamp: number): boolean => {
  const currentTime = Date.now();
  const fiveMinutesInMillis = 5 * 60 * 1000;
  return currentTime - timestamp > fiveMinutesInMillis;
};
