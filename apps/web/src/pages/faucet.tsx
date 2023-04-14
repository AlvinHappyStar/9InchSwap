import styled from 'styled-components'
import Faucet from '../views/Faucet'

const MobileView = styled.div`
  @media (max-width: 767px) {
  & {    
    // position:absolute;
  }
}
`
const FaucetPage = () => {
  return (
    <>
      {/* <MobileView> */}
        <img style={{
          position: 'fixed',
          width: '100%',
          height: '100vh',
          zIndex: '-1',
          marginTop: '-50px',
          objectFit:'cover',
        }}
          alt=''
          src='/images/bg3.png' />
      {/* </MobileView> */}
      <Faucet />
    </>
  )

}

export default FaucetPage
