import { FixedNumber } from '@ethersproject/bignumber'
import { ChainId } from '@pancakeswap/sdk'

export const FIXED_ZERO = FixedNumber.from(0)
export const FIXED_ONE = FixedNumber.from(1)
export const FIXED_TWO = FixedNumber.from(2)

export const FARM_AUCTION_HOSTING_IN_SECONDS = 691200

export const masterChefAddresses = {
  [ChainId.GOERLI]: '0x1F5A0483bee4F446d2bA8CCC066D1768dc4985dc',
  [ChainId.BSC_TESTNET]: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  [ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
}

export const nonBSCVaultAddresses = {
  [ChainId.ETHEREUM]: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  [ChainId.GOERLI]: '0x1F5A0483bee4F446d2bA8CCC066D1768dc4985dc',
}
