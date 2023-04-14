import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, BLOCKS_CLIENT_GOERLI, INFO_CLIENT, INFO_CLIENT_ETH, INFO_CLIENT_GOERLI } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoClientGoerli, infoStableSwapClient } from 'utils/graphql'

import { ChainId } from '@pancakeswap/sdk'
import {
  ETH_TOKEN_BLACKLIST,
  PCS_ETH_START,
  PCS_V2_START,
  TOKEN_BLACKLIST,
  BSC_TOKEN_WHITELIST,
  ETH_TOKEN_WHITELIST,
  PCS_GOERLI_START,
  GOERLI_TOKEN_BLACKLIST,
  GOERLI_TOKEN_WHITELIST,
} from 'config/constants/info'

export type MultiChainName = 'BSC' | 'ETH' | 'GOERLI'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
  GOERLI: 'ETH',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  GOERLI: BLOCKS_CLIENT_GOERLI
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  ETH: PCS_ETH_START,
  GOERLI: PCS_GOERLI_START
}

export const multiChainStartBlock = {
  BSC: 0,
  ETH: 0,
  GOERLI: 8694825
}

export const multiChainId = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
  GOERLI: ChainId.GOERLI,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '/eth',
  [ChainId.GOERLI]: '',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
  GOERLI: infoClientGoerli,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
  GOERLI: INFO_CLIENT_GOERLI
}

export const multiChainScan = {
  BSC: 'BscScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
  GOERLI: GOERLI_TOKEN_BLACKLIST,
}

export const multiChainTokenWhiteList = {
  BSC: BSC_TOKEN_WHITELIST,
  ETH: ETH_TOKEN_WHITELIST,
  GOERLI: GOERLI_TOKEN_WHITELIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
