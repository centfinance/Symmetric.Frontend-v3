import {
  GqlChain,
  GqlPoolMinimalType,
} from '@/services/api/graphql/generated/api-types';
import { ApiVotingPool } from '@/services/balancer/gauges/gauge-controller.decorator';

/*
 Fake voting Pool data to test voting list UI in testnet networks
*/
export function meterVotingPools(network: 'meter'): ApiVotingPool[] {
  const USDT_suUSD_USDC: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002',
    address: '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee',
    type: GqlPoolMinimalType.Stable,
    symbol: 'USDT-USDC-suUSD',
    tokens: [
      {
        address: '0x5fa41671c48e3c951afc30816947126ccc8c162e',
        weight: null,
        symbol: 'USDT.eth',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x5fa41671c48e3c951afc30816947126ccc8c162e.png',
      },
      {
        address: '0x8bf591eae535f93a242d5a954d3cde648b48a5a8',
        weight: null,
        symbol: 'suUSD',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x8bf591eae535f93a242d5a954d3cde648b48a5a8.png',
      },
      {
        address: '0xd86e243fc0007e6226b07c9a50c9d70d78299eb5',
        weight: null,
        symbol: 'USDC.eth',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0xd86e243fc0007e6226b07c9a50c9d70d78299eb5.png',
      },
    ],
    gauge: {
      address: '0x59f5a4c2d848c172c88118010019cf9297aacee6',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const USDT_suUSD_USDC_MTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7000200000000000000000003',
    address: '0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7',
    type: GqlPoolMinimalType.Weighted,
    symbol: '50ETH-50wstMTRG',
    tokens: [
      {
        address: '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee',
        weight: '0.5',
        symbol: 'USDT-USDC-suUSD',
        logoURI:
          'https://raw.githubusercontent.com/centfinance/tokenlists/main/src/assets/images/tokens/0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee.png',
      },
      {
        address: '0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3',
        weight: '0.5',
        symbol: 'MTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3.png',
      },
    ],
    gauge: {
      address: '0x63f9d4a03a58d1a329a3a1393a9a1e5525eb65a1',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const MST_MTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0xc4187382305ea2c953f0a164f02b4d27c9957db5000200000000000000000005',
    address: '0xc4187382305ea2c953f0a164f02b4d27c9957db5',
    type: GqlPoolMinimalType.Weighted,
    symbol: '50MTRG-50MST',
    tokens: [
      {
        address: '0x5647f6cc997e45b81d786baa9ecd8a1ad40ef25f',
        weight: '0.5',
        symbol: 'MST',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x5647f6cc997e45b81d786baa9ecd8a1ad40ef25f.png',
      },
      {
        address: '0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3',
        weight: '0.5',
        symbol: 'MTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3.png',
      },
    ],
    gauge: {
      address: '0xedf47a2de3adf4a0d91864e1b9d377b46c8172dc',
      isKilled: true,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const MST_wstMTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0xbfd3c6457069bf173714f344447be468a83e7bd500020000000000000000000b',
    address: '0xbfd3c6457069bf173714f344447be468a83e7bd5',
    type: GqlPoolMinimalType.Weighted,
    symbol: '50MST-50wstMTRG',
    tokens: [
      {
        address: '0x5647f6cc997e45b81d786baa9ecd8a1ad40ef25f',
        weight: '0.5',
        symbol: 'MST',
        logoURI:
          'https://raw.githubusercontent.com/swapsicledex/swapsicle-token-list/master/logos/telos/0x568524DA340579887db50Ecf602Cd1BA8451b243/logo.png',
      },
      {
        address: '0xe2de616fbd8cb9180b26fcfb1b761a232fe56717',
        weight: '0.5',
        symbol: 'wstMTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3.png',
      },
    ],
    gauge: {
      address: '0xd24A6b56e7aca38FeF74998E1E99b9586007eA55',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const ETH_wstMTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0x6e1be32644975613212db00bb9762fb6755ab921000200000000000000000007',
    address: '0x6e1be32644975613212db00bb9762fb6755ab921',
    type: GqlPoolMinimalType.Weighted,
    symbol: '50ETH-50wstMTRG',
    tokens: [
      {
        address: '0x983147fb73a45fc7f8b4dfa1cd61bdc7b111e5b6',
        weight: '0.5',
        symbol: 'ETH',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x983147fb73a45fc7f8b4dfa1cd61bdc7b111e5b6.png',
      },
      {
        address: '0xe2de616fbd8cb9180b26fcfb1b761a232fe56717',
        weight: '0.5',
        symbol: 'wstMTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0xe2de616fbd8cb9180b26fcfb1b761a232fe56717.png',
      },
    ],
    gauge: {
      address: '0x8be2035d45f31b9827af789f6d4f8ce460372b2c',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const MTRG_wstMTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0x2077a828fd58025655335a8756dbcfeb7e5bec46000000000000000000000008',
    address: '0x2077a828fd58025655335a8756dbcfeb7e5bec46',
    type: GqlPoolMinimalType.Stable,
    symbol: 'MTRG-wstMTRG',
    tokens: [
      {
        address: '0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3',
        weight: 'null',
        symbol: 'MTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0x228ebbee999c6a7ad74a6130e81b12f9fe237ba3.png',
      },
      {
        address: '0xe2de616fbd8cb9180b26fcfb1b761a232fe56717',
        weight: 'null',
        symbol: 'wstMTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0xe2de616fbd8cb9180b26fcfb1b761a232fe56717.png',
      },
    ],
    gauge: {
      address: '0x0e533ff0486f8372096e889efdf71b323ed4f545',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const MSYMM_wstMTRG: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0xabbcd1249510a6afb5d1e6d055bf86637e7dad63000200000000000000000009',
    address: '0xabbcd1249510a6afb5d1e6d055bf86637e7dad63',
    type: GqlPoolMinimalType.Weighted,
    symbol: '80mSYMM-20wstMTRG',
    tokens: [
      {
        address: '0x663345e09f4f4437f3d5df39ba5c2b5690532206',
        weight: '0.8',
        symbol: 'mSYMM',
        logoURI:
          'https://raw.githubusercontent.com/centfinance/tokenlists/main/src/assets/images/tokens/mSYMM.png',
      },
      {
        address: '0xe2de616fbd8cb9180b26fcfb1b761a232fe56717',
        weight: '0.2',
        symbol: 'wstMTRG',
        logoURI:
          'https://raw.githubusercontent.com/meterio/token-list/master/generated/token-logos/meter/0xe2de616fbd8cb9180b26fcfb1b761a232fe56717.png',
      },
    ],
    gauge: {
      address: '0x2b61c7b6b0bd087043d822c35d8f7d28d6ce0b4b',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '1.0',
    },
  };

  const Burn_mSYMM: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000d',
    address: '',
    type: GqlPoolMinimalType.Unknown,
    symbol: 'Burn mSYMM',
    tokens: [
      {
        address: '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca',
        weight: '0.8',
        symbol: 'burn mSYMM',
        logoURI: 'https://em-content.zobj.net/source/apple/391/fire_1f525.png',
      },
    ],
    gauge: {
      address: '0x306F5A0b2976A1c6a526cbBfD0d33C8232a467c2',
      isKilled: false,
      relativeWeightCap: '1.0',
      addedTimestamp: 1701860941,
    },
  };

  const Burn_mSYMM_deprecated: ApiVotingPool = {
    chain: network as GqlChain,
    id: '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000d',
    address: '',
    type: GqlPoolMinimalType.Unknown,
    symbol: 'Burn mSYMM',
    tokens: [
      {
        address: '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca',
        weight: '0.8',
        symbol: 'burn mSYMM Deprecated',
        logoURI: 'https://em-content.zobj.net/source/apple/391/fire_1f525.png',
      },
    ],
    gauge: {
      address: '0xF4D1405df236BB5bD654B40Db4C055cb59522939',
      isKilled: true,
      relativeWeightCap: '1.0',
      addedTimestamp: 1701860941,
    },
  };

  return [
    USDT_suUSD_USDC,
    USDT_suUSD_USDC_MTRG,
    MST_MTRG,
    MST_wstMTRG,
    ETH_wstMTRG,
    MTRG_wstMTRG,
    MSYMM_wstMTRG,
    Burn_mSYMM,
    Burn_mSYMM_deprecated,
  ];
}
