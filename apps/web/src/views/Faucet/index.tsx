import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'

import { Heading, Text, Input, Button, useToast, Link } from '@pancakeswap/uikit'

const FaucetH1 = styled(Heading)`
  font-size: 32px;
  margin-bottom: 8px;
  font-family: 'Riffic Free';
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 50px;
    margin-bottom: 24px;
  }
`

const InputPanel = styled.div`
  background: transparent;
  display: flex;
  width: 700px;
  position: absolute;
  margin-top: 80px;
  flex-direction: column;
  @media (max-width: 767px) {
  & {    
    background: "#fff";
    width:350px;
  }
  
`
const StyledInput = styled(Input)`
  border-radius: 8px;
  height: 30px;
  background: rgba(34, 22, 27, 0.8);
`
const ClaimButton = styled(Button)`
  // background: linear-gradient(180deg, #7a436e, #7c364c);
  background: linear-gradient(180deg, #6e7350, #4e7051);
  height:100%;
  width:150px;
  font-size:18px;
  margin-left: 10px;
`
function validateInputAddresses(address) {
  return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}

export default function Faucet() {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const [waddress, setWalletAddress] = useState("")
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    setWalletAddress(account)
  }, [account]);

  const callClaimRequest = async () => {

    if (!validateInputAddresses(waddress)) {
      toastError(t('Input Error'), 'ETH address incorrect')
      return;
    }

    const requestBody = {
      "wallet_address": waddress
    }
    const response = await fetch('https://faucetapi.9inch.io/api/v1/claim', {
      method: 'POST',
      body: JSON.stringify(requestBody), // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseJson = await response.json();

    if (responseJson.error !== undefined) {
      toastError(t('Claim Fail'), responseJson.error)
    } else {
      // show toast success with tx hash
      const link = `https://goerli.etherscan.io/tx/${responseJson.tx_hash}`
      const toastLink = (
        <Link href={link} color="#fff" fontSize="16px" mr="4px" mb="20px" target="_blank">
          View on Etherscan
        </Link>
      )

      toastSuccess(t('Claim Success'), toastLink)
    }

  }

  return (
    <>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        background:'transparent',
      }}>
        <InputPanel>
          <FaucetH1 as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Faucet')}
          </FaucetH1>
          <div style={{
            borderRadius: '20px',
            width: '100%',
            backgroundColor: 'rgba(6, 3, 5, 0.8)',
            border: '1px solid rgb(93, 92, 93)',
            boxShadow: 'rgb(255, 255, 255) 0px 2px 8px',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px',
          }}>
            <Text color="#fff" fontSize="16px" mr="4px" mb="20px">
              {t('Get free ETH to try out 9INCH on Testnet')}
            </Text>
            <div style={{
              display: 'flex',
              height: '30px',
              flexDirection: 'row',
              marginBottom: '20px',
            }}>
              <StyledInput placeholder='Enter address...' value={waddress} onChange={(event) => { setWalletAddress(event.target.value) }} />
              <ClaimButton onClick={callClaimRequest}>
                <Text color="#fff" fontSize="16px" mr="4px">
                  {t('Claim')}
                </Text>
              </ClaimButton>
            </div>

            
          </div>
        </InputPanel>
      </div>
    </>
  )
}
