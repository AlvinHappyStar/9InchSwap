import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useGetChainName } from 'state/info/hooks'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const chainName = useGetChainName()
  const { t } = useTranslation()
  const isStableSwap = router.query.type === 'stableSwap'

  const isPairs = router.pathname === '/info/pairs'
  const isOverview = router.pathname === '/info'

  useEffect(() => {
    if (account && chainId === ChainId.BSC && router.query.chainName === 'eth')
      router.replace('/info', undefined, { shallow: true })
    else if (account && chainId === ChainId.ETHEREUM && router.query.chainName !== 'eth')
      router.replace('/info/eth', undefined, { shallow: true })
    else if (isStableSwap && router.query.chainName) {
      if (router.query.chainName === 'eth') {
        router.replace('/info/eth', undefined, { shallow: true })
      } else {
        router.replace('/info?type=stableSwap', undefined, { shallow: true })
      }
    }
  }, [isStableSwap, chainId, account, chainName, router])

  return (
    <>
      <div style = {{
        display:'flex',
        overflow:'hidden',
        justifyContent:'space-around',
      }}>
        <SubMenuItems
          items={[
            {
              label: 'Overview',
              href: '/info',
            },
            {
              label: 'Pairs',
              href: '/info/pairs',
            },
            {
              label: 'Tokens',
              href: '/info/Tokens',
            },
          ]}
          activeItem= {isOverview ? ('/info') 
          : isPairs ? ('/info/pairs') : ('/info/Tokens')}
        />
      </div>

      <InfoNav isStableSwap={isStableSwap} />
      {children}
    </>
  )
}
