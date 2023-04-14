import { ChainId } from '@pancakeswap/sdk'
import FarmsBscPriceHelper from './bsc'
import FarmsBscTestnetPriceHelper from './bsc_testnet'
import FarmsEthereumPriceHelper from './ethereum'
import FarmsGoerliPriceHelper from './goerli'

export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return FarmsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return FarmsBscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return FarmsEthereumPriceHelper
    case ChainId.GOERLI:
      return FarmsGoerliPriceHelper
    default:
      return []
  }
}
