// import { useMemo, useState } from 'react'
import { Currency, Pair, Token, CurrencyAmount } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, NumericalInput } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
// import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
// import { WrappedTokenInfo } from '@pancakeswap/token-lists'

import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { useAccount } from 'wagmi'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

// import AddToWalletButton from '../AddToWallet/AddToWalletButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' }) <{ zapStyle?: ZapStyle }>`
  padding: 0.5rem 0;
  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '8px' : '0px'} 8px 8px 8px;
      height: auto;
    `};
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div`
@media (max-width: 767px) {
& {
  width:130px;
}
}
  display: flex;
  // width: 100%;
  flex-flow: column;
  position: relative;
  // background-color: ${({ theme }) => theme.colors.backgroundAlt};
  
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  
  // box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 0px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onPercentInput?: (percent: number) => void
  onMax?: () => void
  showQuickInputButton?: boolean
  showMaxButton: boolean
  maxAmount?: CurrencyAmount<Currency>
  lpPercent?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | StablePair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showUSDPrice?: boolean
  tokensToShow?: Token[]
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  // onPercentInput,
  onMax,
  // showQuickInputButton = false,
  showMaxButton,
  maxAmount,
  lpPercent,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  // id,
  showCommonBases,
  commonBasesType,
  showSearchInput,
  disabled,
  error,
  showUSDPrice,
  tokensToShow,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  // const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  // const tokenAddress = token ? isAddress(token.address) : null

  const amountInDollar = useBUSDCurrencyAmount(
    showUSDPrice ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      showSearchInput={showSearchInput}
      tokensToShow={tokensToShow}
    />,
  )

  // const percentAmount = useMemo(
  //   () => ({
  //     25: maxAmount ? maxAmount.multiply(new Percent(25, 100)).toExact() : undefined,
  //     50: maxAmount ? maxAmount.multiply(new Percent(50, 100)).toExact() : undefined,
  //     75: maxAmount ? maxAmount.multiply(new Percent(75, 100)).toExact() : undefined,
  //   }),
  //   [maxAmount],
  // )

  // const [currentClickedPercent, setCurrentClickedPercent] = useState('')

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')

  return (
    // <Box position="relative" id={id}>
    <div style={{
      width: '100%',
      height: '100px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // color: '#F4EEFF',
      // background: 'linear-gradient(90deg, #0d0a0c 0%, #110d0e 50%, #0d0b0c 100%)',
      background: 'linear-gradient(90deg, #0a0008 0%, #090008 50%, #080108 100%)',
      borderRadius:'5px',
    }}>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error}>
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
                // setCurrentClickedPercent('')
              }}
            />
          </LabelRow>
          {!!currency && showUSDPrice && (
            <Flex justifyContent="flex-start" ml="1rem">
              <Flex maxWidth="200px">
                {Number.isFinite(amountInDollar) ? (
                  <Text fontSize="12px" color="#fff">
                    ~{formatNumber(amountInDollar)} USD
                  </Text>
                ) : (
                  <Box height="18px" />
                )}
              </Flex>
            </Flex>
          )}
          <InputRow selected={disableCurrencySelect}>
            {account && currency && selectedCurrencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
              <Flex alignItems="center" justifyContent="right">
                {/* {maxAmount?.greaterThan(0) &&
                  showQuickInputButton &&
                  onPercentInput &&
                  [25, 50, 75].map((percent) => {
                    const isAtClickedPercent = currentClickedPercent === percent.toString()
                    const isAtCurrentPercent =
                      (maxAmount && value !== '0' && value === percentAmount[percent]) ||
                      (lpPercent && lpPercent === percent.toString())

                    return (
                      <Button
                        key={`btn_quickCurrency${percent}`}
                        onClick={() => {
                          onPercentInput(percent)
                          setCurrentClickedPercent(percent.toString())
                        }}
                        scale="sm"
                        mr="5px"
                        variant={isAtClickedPercent || isAtCurrentPercent ? 'primary' : 'secondary'}
                        style={{ textTransform: 'uppercase' }}
                      >
                        {percent}%
                      </Button>
                    )
                  })} */}
                {maxAmount?.greaterThan(0) && showMaxButton && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onMax?.()
                      // setCurrentClickedPercent('MAX')
                    }}
                    scale="xs"
                    variant={isAtPercentMax ? 'primary' : 'secondary'}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t('Max')}
                  </Button>
                )}
              </Flex>
            )}
          </InputRow>
        </Container>
        {disabled && <Overlay />}
      </InputPanel>

      <Flex flexDirection="column" alignItems="left" justifyContent="left">
        <Flex>
          {beforeButton}
          <CurrencySelectButton
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="left">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" fontSize="20px" minWidth="60px">
                  {(currency && currency.symbol && currency.symbol.length > 10
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              <div>
              {!disableCurrencySelect && <ChevronDownIcon style={{
                marginRight:'20px',
              }} />}
              </div>
            </Flex>
          </CurrencySelectButton>
          {/* {token && tokenAddress ? (
            <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={tokenAddress}
                tooltipMessage={t('Token address copied')}
              />
              <AddToWalletButton
                variant="text"
                p="0"
                height="auto"
                width="fit-content"
                tokenAddress={tokenAddress}
                tokenSymbol={token.symbol}
                tokenDecimals={token.decimals}
                tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
              />
            </Flex>
          ) : null} */}
        </Flex>
        {account && (
          <Text
            onClick={!disabled && onMax}
            color="textSubtle"
            fontSize="14px"
            style={{ display: 'inline', cursor: 'pointer', maxWidth:'150px', overflow:'hidden'}}
            mt="10px"
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toFixed(5) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
    {/* </Box > */}
    </div>
  )
}
