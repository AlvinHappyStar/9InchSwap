import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useAccount, useChainId } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import abiPair from 'config/abi/IPancakePair.json'
import abiRouter from 'config/abi/IPancakeRouter02.json'
import abiBuyBurn from 'config/abi/SFYXBuyAndBurnV3.json'

import {
  Heading,
  Text,
  Button,
  useToast,
  Box,
  Flex,
  Card,
  FlexGap,
  TokenPairImage,
  TransactionErrorContent,
  ArrowBackIcon,
  ArrowForwardIcon,
  Checkbox,
  Skeleton,
} from '@pancakeswap/uikit'

import Page from 'components/Layout/Page'
import { BigNumber, ethers } from 'ethers'
import { multicallv3 } from 'utils/multicall'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { SLOW_INTERVAL } from 'config/constants'
import { CAKE, EARN } from '@pancakeswap/tokens'
import { ChainId, WNATIVE } from '@pancakeswap/sdk'
import { useContract } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { ChainMap } from 'config/constants/types'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Break, ClickableColumnHeader, PageButtons, TableWrapper } from 'views/Info/components/InfoTables/shared'
import { Arrow } from '@pancakeswap/uikit/src/components/PaginationButton/PaginationButton'
import CircleLoader from 'components/Loader/CircleLoader'

const BurnInfo = styled(Card)`
border-radius: 8px;
border:none;
margin-top:40px;
background: #24011faa;
> div {
    padding: 2em;
  }
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 0.2fr 2fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 0.2fr 2fr repeat(2, 1fr);
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 600px) {
    grid-template-columns: 0.2fr 2fr 1fr;
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(5) {
      display: none;
    }
  }
`

const BurnTable = styled(TableWrapper)`
  border-radius: 25px;
  width: 100%;
  background: #24011faa;
  border: 1px solid rgb(93, 92, 93);
  box-shadow: rgb(255, 255, 255) 0px 2px 8px;
`


const ZERO = BigNumber.from(0)
const ONE = ethers.utils.parseEther('1')

const BURNER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x99F27Bfa28816EB18F0d9343e6F312CC7bf0081a',
  [ChainId.GOERLI]: '0x99F27Bfa28816EB18F0d9343e6F312CC7bf0081a',
  [ChainId.BSC]: '0x99F27Bfa28816EB18F0d9343e6F312CC7bf0081a',
  [ChainId.BSC_TESTNET]: '0x99F27Bfa28816EB18F0d9343e6F312CC7bf0081a',
}

export default function Burn() {
  const chainId = useChainId()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const SORT_FIELD = {
    name: 'name',
    usdValue: 'usdValue',
    amount0: 'amount0',
    amount1: 'amount1',
    balance: 'balance',
  }

  const pageSize = 10
  const [sortField, setSortField] = useState(SORT_FIELD.name)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [lpTokens, setLPTokens] = useState<any[]>([])
  const [selectedRows, selectRows] = useState<number[]>([])
  const [status, setStatus] = useState({
    rateSFY: 8571,
    rateSFYX: 1429,
    rateBounty: 10,
    totalSFY: ZERO,
    selectedUSD: ZERO,
    burnSFY: ZERO,
    burnSFYX: ZERO,
    bountySFY: ZERO,
    bountySFYX: ZERO,
    bountyUSD: ZERO,
  })
  const { data: farmsLP, userDataLoaded } = useFarms()

  const contract = useContract(BURNER_ADDRESS[chainId], abiBuyBurn, true)

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  const handleBurn = async () => {
    const LPs = selectedRows.map((i) => lpTokens[i].address)
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(contract, 'convertLps', [LPs])
    })
    if (receipt?.status) {
      getLPTokensByFarms()
      toastSuccess(
        t('Success'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('Successfully burnt!')}</ToastDescriptionWithTx>,
      )
    }
    // contract.estimateGas.convertLps(LPs)
    //   .then((gasEstimate) => {
    //     // toastSuccess(
    //     //   t("LPs Burnt"),
    //     //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>{successMsg}</ToastDescriptionWithTx>,
    //     // )
    //   })
    //   .catch((e) => {
    //     toastError(t("Error"), transactionErrorToUserReadableMessage(e, t))
    //   })
  }

  const getBurnConfig = async () => {
    const calls = [
      {
        abi: abiBuyBurn,
        address: BURNER_ADDRESS[chainId],
        name: 'SFYBuyBurnPercentage',
      },
      {
        abi: abiBuyBurn,
        address: BURNER_ADDRESS[chainId],
        name: 'SFYXBuyBurnPercentage',
      },
      {
        abi: abiBuyBurn,
        address: BURNER_ADDRESS[chainId],
        name: 'BOUNTY_FEE',
      },
    ]
    const [rateSFY, rateSFYX, rateBounty] = await multicallv3({ calls, chainId })
    setStatus({
      ...status,
      rateSFY: rateSFY ? rateSFY[0]?.toNumber() : status.rateSFY,
      rateSFYX: rateSFYX ? rateSFYX[0]?.toNumber() : status.rateSFYX,
      rateBounty: rateBounty ? rateBounty[0]?.toNumber() : status.rateBounty,
    })
  }

  const calcBurnState = async () => {
    const state: any = {
      selectedUSD: ZERO,
      burnSFY: ZERO,
      burnSFYX: ZERO,
      bountySFY: ZERO,
      bountySFYX: ZERO,
      bountyUSD: ZERO,
    }
    const calls: any[] = [
      {
        abi: abiBuyBurn,
        address: BURNER_ADDRESS[chainId],
        name: 'burnedSFYX',
      },
    ]
    let amountETH = ZERO
    let priceSFY = ZERO
    let priceSFYX = ZERO
    if (selectedRows.length) {
      for (const id of selectedRows) {
        const token = lpTokens[id]
        if (priceSFY.eq(0) && token.token0.toLowerCase() === CAKE[chainId].address.toLowerCase())
          priceSFY = token.price0
        if (priceSFY.eq(0) && token.token1.toLowerCase() === CAKE[chainId].address.toLowerCase())
          priceSFY = token.price1
        if (priceSFYX.eq(0) && token.token0.toLowerCase() === EARN[chainId].address.toLowerCase())
          priceSFYX = token.price0
        if (priceSFYX.eq(0) && token.token1.toLowerCase() === CAKE[chainId].address.toLowerCase())
          priceSFYX = token.price1
        if (token.token0.toLowerCase() !== WNATIVE[chainId].address.toLowerCase()) {
          calls.push({
            abi: abiRouter,
            address: ROUTER_ADDRESS[chainId],
            name: 'getAmountsOut',
            params: [token.amount0, [token.token0, WNATIVE[chainId].address]],
          })
        } else amountETH = amountETH.add(token.amount0)
        if (token.token1.toLowerCase() !== WNATIVE[chainId].address.toLowerCase()) {
          calls.push({
            abi: abiRouter,
            address: ROUTER_ADDRESS[chainId],
            name: 'getAmountsOut',
            params: [token.amount1, [token.token1, WNATIVE[chainId].address]],
          })
        } else amountETH = amountETH.add(token.amount1)
      }
      state.selectedUSD = lpTokens.reduce((usd, token, id) => {
        if (selectedRows.includes(id)) {
          return usd.add(token.usd0).add(token.usd1)
        }
        return usd
      }, ZERO)
    }
    const results = await multicallv3({ calls, chainId })
    state.totalSFY = results[0][0] ?? ZERO
    results.forEach((result, i) => {
      if (i > 0) amountETH = amountETH.add(result[0][1])
    })
    if (amountETH.gt(0)) {
      calls.splice(0)
      calls.push({
        abi: abiRouter,
        address: ROUTER_ADDRESS[chainId],
        name: 'getAmountsOut',
        params: [amountETH.mul(status.rateSFY).div(10000), [WNATIVE[chainId].address, CAKE[chainId].address]],
      })
      calls.push({
        abi: abiRouter,
        address: ROUTER_ADDRESS[chainId],
        name: 'getAmountsOut',
        params: [amountETH.mul(status.rateSFYX).div(10000), [WNATIVE[chainId].address, EARN[chainId].address]],
      })
      const results2 = await multicallv3({ calls, chainId })
      const burnSFY = results2[0][0][1] ?? ZERO
      const burnSFYX = results2[1][0][1] ?? ZERO
      state.bountySFY = burnSFY.mul(status.rateBounty).div(10000)
      state.bountySFYX = burnSFYX.mul(status.rateBounty).div(10000)
      state.burnSFY = burnSFY.sub(state.bountySFY)
      state.burnSFYX = burnSFYX.sub(state.bountySFYX)
      state.bountyUSD = state.bountySFY.mul(priceSFY).add(state.bountySFYX.mul(priceSFYX)).div(ONE)
    }
    setStatus({ ...status, ...state })
  }

  const getLPTokensByFarms = async () => {
    const calls = []
    for (const farm of farmsLP) {
      const address = farm.lpAddress
      calls.push({
        abi: abiPair,
        address,
        name: 'balanceOf',
        params: [BURNER_ADDRESS[chainId]],
      })
      calls.push({
        abi: abiPair,
        address,
        name: 'totalSupply',
      })
      calls.push({
        abi: abiPair,
        address,
        name: 'getReserves',
      })
    }
    multicallv3({ calls, chainId }).then((results) => {
      const tokens = []
      let i = 0
      for (const farm of farmsLP) {
        const [balance] = results[i++]
        const [totalSupply] = results[i++]
        const [reserve0, reserve1] = results[i++]
        if (balance.gt(0)) {
          tokens.push({
            address: farm.lpAddress,
            symbol: `${farm.token.symbol} / ${farm.quoteToken.symbol}`,
            balance,
            token0: farm.token.address,
            token1: farm.quoteToken.address,
            amount0: balance.mul(reserve0).div(totalSupply),
            amount1: balance.mul(reserve1).div(totalSupply),
            price0: ethers.utils.parseEther(farm.tokenPriceBusd),
            price1: ethers.utils.parseEther(farm.quoteTokenPriceBusd),
            usd0: balance
              .mul(reserve0)
              .mul(ethers.utils.parseEther(farm.tokenPriceBusd))
              .div(ethers.utils.parseEther(totalSupply.toString())),
            usd1: balance
              .mul(reserve1)
              .mul(ethers.utils.parseEther(farm.quoteTokenPriceBusd))
              .div(ethers.utils.parseEther(totalSupply.toString())),
          })
        }
      }
      setLPTokens(tokens)
      setMaxPage(Math.floor(tokens.length / pageSize) + (tokens.length % pageSize ? 1 : 0))
    })
  }

  usePollFarmsWithUserData()

  useEffect(() => {
    getBurnConfig()
    const timer = setInterval(getBurnConfig, SLOW_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (userDataLoaded) getLPTokensByFarms()
  }, [userDataLoaded])

  useEffect(() => {
    if (userDataLoaded) calcBurnState()
  }, [userDataLoaded, selectedRows])

  const TokenInfo = (props) => {
    return useMemo(
      () => (
        <FlexGap gap="1em" alignItems="center">
          <div style={{ flexBasis: '32px', flexGrow: 0, flexShrink: 0 }}>
            <TokenPairImage
              width={32}
              height={32}
              variant="inverted"
              primarySrc={`/images/${chainId}/tokens/${props.token0}.png`}
              secondarySrc={`/images/${chainId}/tokens/${props.token1}.png`}
              {...props}
            />
          </div>
          <div>{props.symbol}</div>
        </FlexGap>
      ),
      [props.token0, props.token1],
    )
  }

  const TableLoader: React.FC<React.PropsWithChildren> = () => {
    const loadingRow = (
      <ResponsiveGrid>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </ResponsiveGrid>
    )
    return <>{[...Array(pageSize)].map(() => loadingRow)}</>
  }

  const formatBigNumber = (bigNumber, decimals = 6) => {
    if (!bigNumber) return '0'

    const value = parseFloat(ethers.utils.formatEther(bigNumber))

    const k = 1024
    const sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

    const i = value < 1 ? 0 : Math.floor(Math.log(value) / Math.log(k))

    return `${parseFloat((value / k ** i).toFixed(i ? 2 : decimals))}${sizes[i]}`
  }

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) selectRows(selectedRows.filter((i) => i !== id))
    else selectRows([...selectedRows, id])
  }

  return (
    // <BurnContext.Provider value={burnLPsMemoized}>
    <Page>
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Heading as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Buy & Burn')}
          </Heading>
          <Heading as="h2" scale="md" color="secondary" mb="20px">
            {t('Select LPs to buy & burn SFY')}
          </Heading>
        </Box>

      </Flex>
      {/* <Heading as="h2" scale="lg" color="secondary" my={3}>
        {t('LPs to Burn')}
      </Heading> */}
      <BurnTable>
        <ResponsiveGrid>
          <div />
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('LPs')}
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.usdValue)}
            textTransform="uppercase"
          >
            {t('USD Value')} {arrow(SORT_FIELD.usdValue)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amount0)}
            textTransform="uppercase"
          >
            {t('Token0 Amount')} {arrow(SORT_FIELD.amount0)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amount1)}
            textTransform="uppercase"
          >
            {t('Token1 Amount')} {arrow(SORT_FIELD.amount1)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.balance)}
            textTransform="uppercase"
          >
            {t('LP Account')} {arrow(SORT_FIELD.balance)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />
        <>
          {userDataLoaded ? (
            lpTokens
              .filter((token, id) => id >= (page - 1) * pageSize && id < page * pageSize)
              .map((token, id) => (
                <Fragment key={token.address}>
                  <ResponsiveGrid>
                    <Checkbox
                      onChange={() => toggleRow(id + (page - 1) * pageSize)}
                      scale="sm"
                      checked={selectedRows.includes(id + (page - 1) * pageSize)}
                    />
                    <Text>
                      <TokenInfo {...token} />
                    </Text>
                    <Text>${formatBigNumber(token.usd0.add(token.usd1), 6)}</Text>
                    <Text>{formatBigNumber(token.amount0, 6)}</Text>
                    <Text>{formatBigNumber(token.amount1, 6)}</Text>
                    <Text>{formatBigNumber(token.balance, 6)}</Text>
                  </ResponsiveGrid>
                  <Break />
                </Fragment>
              ))
          ) : (
            <TableLoader />
          )}
        </>
        <PageButtons>
          <Arrow
            onClick={() => {
              setPage(page === 1 ? page : page - 1)
            }}
          >
            <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>

          <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
          <Arrow
            onClick={() => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </PageButtons>
      </BurnTable>
      <Flex alignItems="flex-end" justifyContent="right">
        <BurnInfo>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '3px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* <Heading as="h2" scale="lg" color="secondary">
              {t('Burn SFY')}
            </Heading>
            <Text fontSize={14} color="textSubtle">
              Total SFY burned: {formatBigNumber(status.totalSFY)}🔥
            </Text>
            </FlexGap> */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Text small color="textSubtle">
                Selected USD value: ${formatBigNumber(status.selectedUSD, 2)}
              </Text>
              <Text small color="textSubtle">
                This would burn: {formatBigNumber(status.burnSFY, 2)} SFY + {formatBigNumber(status.burnSFYX, 2)} SFYX
              </Text>
              <Text color="secondary">
                Bounty: {formatBigNumber(status.bountySFY, 2)} SFY + {formatBigNumber(status.bountySFYX, 2)} SFYX / $
                {formatBigNumber(status.bountyUSD, 2)}
              </Text>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: '20px',
            }}>
              <img style={{
                width: '40px',
              }}
                alt=''
                src='/images/burn_logo.png' />
            </div>
          </div>
          <Button mt={3} width="100%" onClick={handleBurn} disabled={pendingTx || selectedRows.length === 0}>
            Burn
            {pendingTx && <CircleLoader stroke="white" />}
          </Button>
        </BurnInfo>
      </Flex>
    </Page>
    // </BurnContext.Provider>
  )
}
