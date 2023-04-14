import styled from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import Swap from '../views/Swap'
import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext'

// const MobileView = styled.div`
//   @media (max-width: 767px) {
//       width:100%;
//       position:absolute;
//     & {
//       // display: none;
      
//       height:100%;
//     }
//   }
// `
const SwapPage = () => {

  return (
    <>
      {/* <MobileView> */}
        <img style={{
          position: 'fixed',
          width: '100%',
          height: '100vh',
          marginTop: '-50px',
          objectFit:'cover',
        }}
          alt=''
          src='/images/bg2.png' />
      {/* </MobileView> */}
      <SwapFeaturesProvider>
        <Swap />
      </SwapFeaturesProvider>
    </>
  )
}

SwapPage.chains = CHAIN_IDS

export default SwapPage
