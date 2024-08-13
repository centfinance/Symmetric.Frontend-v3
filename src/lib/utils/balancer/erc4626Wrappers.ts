import { Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { WeiPerEther as ONE } from '@ethersproject/constants';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { walletService } from '@/services/web3/wallet.service';

const { erc4626Wrappers } = configService.network.tokens.Addresses;

type ConversionParams = {
  amount: BigNumber;
  isWrap: boolean; // e.g. is stETH to wstETH
};

function getRateProviderAddress(wrapper: string) {
  if (!erc4626Wrappers)
    throw new Error('No erc4626Wrappers, cannot perform unwrap');
  const rateProviderInfo =
    configService.network.rateProviders[wrapper.toLowerCase()];
  if (!rateProviderInfo || Object.keys(rateProviderInfo).length === 0)
    throw new Error('ERC4626 wrapper rate provider not set in config');
  const rateProvider = Object.keys(rateProviderInfo)[0];
  return rateProvider;
}

// export function isStETH(tokenInAddress: string, tokenOutAddress: string) {
//   if (!tokenInAddress || !tokenOutAddress || !stEthAddress) return false;

//   return includesAddress([tokenInAddress, tokenOutAddress], stEthAddress);
// }

// export function isStEthAddress(address: string): boolean {
//   if (!stEthAddress) return false;
//   return address.toLowerCase() === stEthAddress.toLowerCase();
// }

// export function isWstEthAddress(address: string): boolean {
//   if (!wstEthAddress) return false;
//   return address.toLowerCase() === wstEthAddress.toLowerCase();
// }

// export function includesWstEth(
//   addresses: string[],
//   wstEthAddress = configService.network.tokens.Addresses.wstETH
// ): boolean {
//   if (!wstEthAddress) return false;

//   return includesAddress(addresses, wstEthAddress);
// }

// /**
//  * @notice Get amount of wstETH for a given amount of stETH
//  */
// export function getWstETHByStETH(stETHAmount: BigNumberish) {
//   if (!wstEthAddress) {
//     throw new Error(
//       'Attempted to read wstETH contract on Network that doesnt support wstETH'
//     );
//   }
//   const wstETH = new Contract(
//     wstEthAddress,
//     [
//       'function getWstETHByStETH(uint256 stETHAmount) external view returns (uint256)',
//     ],
//     rpcProviderService.jsonProvider
//   );
//   return wstETH.getWstETHByStETH(stETHAmount);
// }

/**
 * Convert stETH amount to wstETH or vice versa. Only relevant on mainnet when wrapping or unwrapping.
 * @param {string} wrapper - The address of the wrapper contract.
 * @param {BigNumber} amount - The amount to convert, could be stETH or wstETH value.
 * @param {boolean} isWrap - True if wrapping stETH to wstETH, false if unwrapping wstETH to stETH.
 * @returns Converted value for wrap or unwrap, if input is stETH, returns wstETH value and vice versa.
 */
export async function convertERC4626Wrap(
  wrapper: string,
  { amount, isWrap }: ConversionParams
) {
  try {
    const rateProvider = new Contract(
      getRateProviderAddress(wrapper),
      ['function getRate() external view returns (uint256)'],
      rpcProviderService.jsonProvider
    );

    const rate = await rateProvider.getRate();

    return isWrap ? amount.mul(ONE).div(rate) : amount.mul(rate).div(ONE);
  } catch (error) {
    throw new Error('Failed to convert to ERC4626 wrapper', { cause: error });
  }
}

export async function convertYieldWrap(
  wrapper: string,
  userAddress: string,
  { amount }: ConversionParams
) {
  try {
    // const provider = getSigner();
    const shares = await walletService.txBuilder.contract.callStatic<BigNumber>(
      {
        contractAddress: wrapper,
        abi: [
          'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
          'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
        ],
        action: 'deposit',
        params: [amount, userAddress],
      }
    );

    console.log('shares', shares.toString());

    // return isWrap ? amount.mul(ONE).div(rate) : amount.mul(rate).div(ONE);
  } catch (error) {
    throw new Error('Failed to convert to ERC4626 wrapper', { cause: error });
  }
}
