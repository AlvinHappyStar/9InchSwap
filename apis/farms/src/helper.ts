import { Obj } from 'itty-router'
import { error } from 'itty-router-extras'
import { createFarmFetcher } from '@pancakeswap/farms'
import { createMulticall } from '@pancakeswap/multicall'
import { bscProvider, bscTestnetProvider, goerliProvider } from './provider'
import { ChainId } from '@pancakeswap/sdk'

export const getProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.BSC:
      return bscProvider
    case ChainId.BSC_TESTNET:
      return bscTestnetProvider
    case ChainId.GOERLI:
      return goerliProvider
    default:
      return goerliProvider
  }
}

const multicall = createMulticall(getProvider)

export const farmFetcher = createFarmFetcher(multicall.multicallv2)

export function requireChainId(params: Obj | undefined) {
  if (!params) {
    return error(400, 'Invalid params')
  }
  const { chainId } = params
  if (!chainId || !farmFetcher.isChainSupported(+chainId)) {
    return error(400, 'Invalid chain id')
  }
  return null
}
