import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

import configs from '@/lib/config';
import { configService } from '@/services/config/config.service';

import { convertStEthWrap } from './lido';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { WalletProvider } from '@/dependencies/wallets/Web3Provider';
import { convertERC4626Wrap } from './erc4626Wrappers';

export enum WrapType {
  NonWrap = 0,
  Wrap,
  Unwrap,
}
export const isYaPoolWrap = (tokenIn: string, tokenOut: string): boolean => {
  const { yaNestedPools } = configService.network.tokens.Addresses;

  if (yaNestedPools) {
    const isTokenOut = Object.keys(yaNestedPools).includes(
      tokenOut.toLowerCase()
    )
      ? true
      : false;

    if (isTokenOut) {
      return (
        yaNestedPools[tokenOut.toLowerCase()].underlying ===
        tokenIn.toLowerCase()
      );
    }
  }
  return false;
};

export const isYaPoolUnwrap = (tokenIn: string, tokenOut: string): boolean => {
  const { yaNestedPools } = configService.network.tokens.Addresses;
  if (yaNestedPools) {
    const isTokenIn = Object.keys(yaNestedPools).includes(tokenIn.toLowerCase())
      ? true
      : false;
    if (isTokenIn) {
      return (
        yaNestedPools[tokenIn.toLowerCase()].underlying ===
        tokenOut.toLowerCase()
      );
    }
  }
  return false;
};

export const isNativeAssetWrap = (
  tokenIn: string,
  tokenOut: string
): boolean => {
  console.log(tokenIn, tokenOut);
  const nativeAddress = configService.network.tokens.Addresses.nativeAsset;
  const wNativeAddress = configService.network.tokens.Addresses.wNativeAsset;
  return tokenIn === nativeAddress && tokenOut === wNativeAddress;
};

export const getWrapAction = (tokenIn: string, tokenOut: string): WrapType => {
  const nativeAddress = configService.network.tokens.Addresses.nativeAsset;
  const wNativeAddress = configService.network.tokens.Addresses.wNativeAsset;
  const { stETH, wstETH, erc4626Wrappers } =
    configService.network.tokens.Addresses;

  if (tokenIn === nativeAddress && tokenOut === wNativeAddress)
    return WrapType.Wrap;

  if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap;

  if (
    erc4626Wrappers &&
    Object.keys(erc4626Wrappers).includes(tokenIn.toLowerCase()) &&
    erc4626Wrappers[tokenIn.toLowerCase()] === tokenOut.toLowerCase()
  )
    return WrapType.Wrap;

  if (tokenOut === nativeAddress && tokenIn === wNativeAddress)
    return WrapType.Unwrap;

  if (tokenOut === stETH && tokenIn === wstETH) return WrapType.Unwrap;

  if (
    erc4626Wrappers &&
    Object.keys(erc4626Wrappers).includes(tokenOut.toLowerCase()) &&
    erc4626Wrappers[tokenOut.toLowerCase()] === tokenIn.toLowerCase()
  )
    return WrapType.Unwrap;

  // if (isYaPoolWrap(tokenIn, tokenOut)) return WrapType.Wrap;

  // if (isYaPoolUnwrap(tokenIn, tokenOut)) return WrapType.Unwrap;

  return WrapType.NonWrap;
};

export const getWrapOutput = async (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumber
): Promise<BigNumber> => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const wNativeAddress = configService.network.tokens.Addresses.wNativeAsset;
  const { wstETH, erc4626Wrappers, yaNestedPools } =
    configService.network.tokens.Addresses;

  if (wrapper === wNativeAddress) return BigNumber.from(wrapAmount);
  if (wrapper === wstETH) {
    return convertStEthWrap({
      amount: wrapAmount,
      isWrap: wrapType === WrapType.Wrap,
    });
  }

  if (
    erc4626Wrappers &&
    Object.values(erc4626Wrappers).includes(wrapper.toLowerCase())
  ) {
    return convertERC4626Wrap(wrapper.toLowerCase(), {
      amount: wrapAmount,
      isWrap: wrapType === WrapType.Wrap,
    });
  }

  if (
    yaNestedPools &&
    Object.keys(yaNestedPools).includes(wrapper.toLowerCase())
  ) {
    return BigNumber.from(wrapAmount);
  }
  throw new Error('Unknown wrapper');
};

export async function wrap(
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  console.log('wrap', wrapper, amount.toString());
  try {
    if (wrapper === configs[network].tokens.Addresses.wNativeAsset) {
      return wrapNative(network, web3, amount);
    } else if (wrapper === configs[network].tokens.Addresses.wstETH) {
      return wrapLido(network, web3, amount);
    } else if (
      configs[network].tokens.Addresses.erc4626Wrappers &&
      Object.values(configs[network].tokens.Addresses.erc4626Wrappers).includes(
        wrapper.toLowerCase()
      )
    ) {
      return wrapERC4626(network, web3, wrapper.toLowerCase(), amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
    return Promise.reject(e);
  }
}

export async function unwrap(
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    if (wrapper === configs[network].tokens.Addresses.wNativeAsset) {
      return unwrapNative(network, web3, amount);
    } else if (wrapper === configs[network].tokens.Addresses.wstETH) {
      return unwrapLido(network, web3, amount);
    } else if (
      configs[network].tokens.Addresses.erc4626Wrappers &&
      Object.values(configs[network].tokens.Addresses.erc4626Wrappers).includes(
        wrapper.toLowerCase()
      )
    ) {
      return unwrapERC4626(network, web3, wrapper.toLowerCase(), amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e);
    return Promise.reject(e);
  }
}

const wrapNative = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].tokens.Addresses.wNativeAsset,
    abi: ['function deposit() payable'],
    action: 'deposit',
    options: { value: amount },
  });
};

const unwrapNative = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].tokens.Addresses.wNativeAsset,
    abi: ['function withdraw(uint256 wad)'],
    action: 'withdraw',
    params: [amount],
  });
};

const wrapLido = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].tokens.Addresses.wstETH,
    abi: ['function wrap(uint256 _stETHAmount) returns (uint256)'],
    action: 'wrap',
    params: [amount],
  });
};

const unwrapLido = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].tokens.Addresses.wstETH,
    abi: ['function unwrap(uint256 _wstETHAmount) returns (uint256)'],
    action: 'unwrap',
    params: [amount],
  });
};

const wrapERC4626 = async (
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  const userAddress = await web3.getSigner().getAddress();
  return await txBuilder.contract.sendTransaction({
    contractAddress: wrapper,
    abi: [
      'function deposit(uint256 assets, address receiver) returns (uint256)',
    ],
    action: 'deposit',
    params: [amount, userAddress],
  });
};

const unwrapERC4626 = async (
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const userAddress = await web3.getSigner().getAddress();
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: wrapper,
    abi: [
      'function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets)',
    ],
    action: 'redeem',
    params: [amount, userAddress, userAddress],
  });
};
