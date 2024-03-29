import styled from 'styled-components'

import { useAccount } from 'wagmi'
import { Heading, Flex, Text, Link, FlexLayout, Loading, Pool, ViewMode } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'

import { useUserPoolsViewMode } from 'state/user/hooks'
import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import CakeVaultCard from './components/CakeVaultCard'
import PoolControls from './components/PoolControls'
import PoolRow, { VaultPoolRow } from './components/PoolsTable/PoolRow'


const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithVault()

  const [vMode, setViewMode] = useUserPoolsViewMode()

  usePoolsPageFetch()

  return (
    <>
      {/* <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Syrup Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader> */}


      <Page>

        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('9INCH Pools')}
        </Heading>

        <div style={{
          borderRadius: '25px',
          width: '100%',

          background: vMode === ViewMode.TABLE ? 'linear-gradient(90deg, #29011f 0%, #27011f 50%, #24011f 100%)' : 'transparent',

          border: vMode === ViewMode.TABLE ? '1px solid rgb(93, 92, 93)' : 'none',
          boxShadow: vMode === ViewMode.TABLE ? 'rgb(255, 255, 255) 0px 2px 8px' : 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <PoolControls pools={pools}>
            {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch, showFinishedPools }) => (
              <>

                {showFinishedPools && (
                  <FinishedTextContainer>
                    <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                      {t('Looking for v1 BBC syrup pools?')}
                    </Text>
                    <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
                      {t('Go to migration page')}.
                    </FinishedTextLink>
                  </FinishedTextContainer>
                )}
                {account && !userDataLoaded && stakedOnly && (
                  <Flex justifyContent="center" mb="4px">
                    <Loading />
                  </Flex>
                )}
                {viewMode === ViewMode.CARD ? (
                  <CardLayout>
                    {chosenPools.map((pool) =>
                      pool.vaultKey ? (
                        <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
                      ) : (
                        <Pool.PoolCard<Token>
                          key={pool.sousId}
                          pool={pool}
                          isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                          cardContent={
                            account ? (
                              <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                            ) : (
                              <>
                                <ConnectWalletButton />
                              </>
                            )
                          }
                          tokenPairImage={
                            <TokenPairImage
                              primaryToken={pool.earningToken}
                              secondaryToken={pool.stakingToken}
                              width={64}
                              height={64}
                            />
                          }
                          cardFooter={<CardFooter pool={pool} account={account} />}
                          aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                        />
                      ),
                    )}
                  </CardLayout>
                ) : (
                  <Pool.PoolsTable>
                    {chosenPools.map((pool) =>
                      pool.vaultKey ? (
                        <VaultPoolRow
                          initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                          key={pool.vaultKey}
                          vaultKey={pool.vaultKey}
                          account={account}
                        />
                      ) : (
                        <PoolRow
                          initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                          key={pool.sousId}
                          sousId={pool.sousId}
                          account={account}
                        />
                      ),
                    )}
                  </Pool.PoolsTable>
                )}

              </>
            )}
          </PoolControls>
        </div>
      </Page>
    </>
  )
}

export default Pools
