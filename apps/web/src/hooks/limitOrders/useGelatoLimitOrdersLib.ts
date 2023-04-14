import { useMemo } from 'react'
import { ChainDefaultId, ChainId } from '@pancakeswap/sdk'
import { BPS_GELATO_FEE, LIMIT_ORDER_SLIPPAGE, STOP_LIMIT_SLIPPAGE_BPS } from '@gelatonetwork/limit-orders-lib/dist/constants'
import { GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import { GELATO_HANDLER } from 'config/constants/exchange'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import { useActiveChainId } from '../useActiveChainId'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(true, true)

  
  return useMemo(() => {
    if (!chainId || !providerOrSigner) {
      console.error('Could not instantiate GelatoLimitOrders: missing chainId or library')
      return undefined
    }
    if (chainId !== ChainDefaultId) return undefined
    try {
      if(chainId as ChainId===ChainId.GOERLI) {
        BPS_GELATO_FEE[chainId] = BPS_GELATO_FEE[ChainId.ETHEREUM]
        STOP_LIMIT_SLIPPAGE_BPS[chainId] = STOP_LIMIT_SLIPPAGE_BPS[ChainId.ETHEREUM]
        LIMIT_ORDER_SLIPPAGE[chainId] = LIMIT_ORDER_SLIPPAGE[ChainId.ETHEREUM]
        return new GelatoLimitOrders(chainId, providerOrSigner, undefined, true)
      }
      return new GelatoLimitOrders(chainId, providerOrSigner, GELATO_HANDLER, false)
    } catch (error: any) {
      console.error(`Could not instantiate GelatoLimitOrders: ${error.message}`, chainId)
      return undefined
    }
  }, [chainId, providerOrSigner])
}

export default useGelatoLimitOrdersLib
