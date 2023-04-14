import styled from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import Liquidity from '../views/Pool'

const MobileView = styled.div`
  @media (max-width: 767px) {
    width:100%;
    position:absolute;
  & {
    // display: none;
    
    height:200%;
  }
}
`
const LiquidityPage = () => {
  return (
    <>
      <MobileView>
        <img style={{
          position: 'fixed',
          width: '100%',
          height: '150vh',
          marginTop: '-50px',
          objectFit:'cover',
        }}
          alt=''
          src='/images/bg4.png' />
      </MobileView>
      <Liquidity />
    </>
  )

}

LiquidityPage.chains = CHAIN_IDS

export default LiquidityPage
