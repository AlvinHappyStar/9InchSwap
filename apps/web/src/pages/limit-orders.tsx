import styled from 'styled-components'
import { CHAIN_IDS } from 'utils/wagmi'
import LimitOrders from '../views/LimitOrders'

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

const LimitOrdersPage = () => {
  return (
    <>
      {/* <MobileView> */}
        <img style={{
          position: 'fixed',
          width: '100%',
          height: '120%',
          marginTop: '-50px',
          objectFit:'cover',
        }}
          alt=''
          src='/images/bg2.png' />
      {/* </MobileView> */}
      <LimitOrders />
    </>
  )
}

LimitOrdersPage.chains = CHAIN_IDS

export default LimitOrdersPage
