import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['tkSYMM', 'TAIKO', 'USDC', 'USDT', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0xa9d23408b9ba935c230493c40c73824df71a0975',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
    WETH: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
    BAL: '0x9c9d0025f27756217bdbb584cfb9dd4aa58b1fec',
    POINTS: '0xAA60Afa2FceC38EE762c52135f6Cbb22D8128DD7',
    rETH: '',
    reward: '',
    rewards: '',
    erc4626Wrappers: {},
    // wstETH: '0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    // USDT
    '0x975ed13fa16857e83e7c493c7741d556eaad4a3f':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    // USDC
    '0x8d97cea50351fb4329d591682b148d43a0c3611b':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xd102ce6a4db07d247fcc28f366a623df0938ca9e':
      '0x7825e833d495f3d1c28872415a4aee339d26ac88',
  },
};

export default tokens;
