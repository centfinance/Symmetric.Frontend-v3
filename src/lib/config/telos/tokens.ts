import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['TSYMM', 'WTLOS', 'USDC', 'USDT', 'STLOS'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
  },
  YaWrapSymbolMap: {
    woUSDC: 'USDC',
    woUSDT: 'USDT',
    woUSDM: 'USDM',
  },
  YaNestedSymbolMap: {
    myaUSDC: 'USDC',
    myaUSDT: 'USDT',
    myaUSDM: 'USDM',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
    WETH: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
    BAL: '0xd5f2a24199c3dfc44c1bf8b1c01ab147809434ca',
    rETH: '',
    reward: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    rewards:
      '0xd102ce6a4db07d247fcc28f366a623df0938ca9e,0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
    erc4626Wrappers: {
      '0x8d97cea50351fb4329d591682b148d43a0c3611b':
        '0x953808ef6be397925f71ec0e8892e246882e4804', //woUSDC
      '0x975ed13fa16857e83e7c493c7741d556eaad4a3f':
        '0x181f14262e2efd4df781079437eba1aed3343898', //woUSDT
      '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9':
        '0x8edc3bdd08980d5f6672f243cebc58c6c117956a', //woUSDM
    },
    yaNestedPools: {
      '0x71fd3b5e53e444ed1e8309b578cffd7d33294c59': {
        poolId:
          '0x71fd3b5e53e444ed1e8309b578cffd7d33294c59000000000000000000000026',
        underlying: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
        wrapper: '0x953808ef6be397925f71ec0e8892e246882e4804',
      },
      '0xc8994727bf84b432a9955403e4335a874c1ae919': {
        poolId:
          '0xc8994727bf84b432a9955403e4335a874c1ae919000000000000000000000027',
        underlying: '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
        wrapper: '0x181f14262e2efd4df781079437eba1aed3343898',
      },
      '0x542a31176829f9dda137942c7cabbb4533523ad3': {
        poolId:
          '0x542a31176829f9dda137942c7cabbb4533523ad3000000000000000000000028',
        underlying: '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
        wrapper: '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
      },
    },
    yaPools: {
      '0xf0333afa20b852776911edb986061cef1376b4fe00000000000000000000002a': {
        underlying: [
          '0x8d97cea50351fb4329d591682b148d43a0c3611b',
          '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
          '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
        ],
        wrappers: [
          '0x953808ef6be397925f71ec0e8892e246882e4804',
          '0x181f14262e2efd4df781079437eba1aed3343898',
          '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
        ],
        underlyingWrapperMap: {
          '0x8d97cea50351fb4329d591682b148d43a0c3611b':
            '0x953808ef6be397925f71ec0e8892e246882e4804',
          '0x975ed13fa16857e83e7c493c7741d556eaad4a3f':
            '0x181f14262e2efd4df781079437eba1aed3343898',
          '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9':
            '0x8edc3bdd08980d5f6672f243cebc58c6c117956a',
        },
        wrapperUnderlyingMap: {
          '0x953808ef6be397925f71ec0e8892e246882e4804':
            '0x8d97cea50351fb4329d591682b148d43a0c3611b',
          '0x181f14262e2efd4df781079437eba1aed3343898':
            '0x975ed13fa16857e83e7c493c7741d556eaad4a3f',
          '0x8edc3bdd08980d5f6672f243cebc58c6c117956a':
            '0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9',
        },
      },
    },
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
