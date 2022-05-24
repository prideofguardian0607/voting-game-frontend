import Button from '@mui/material/Button'
import Router from 'next/router'

const MyApp = ({ Component, pageProps }) => {
    return (
        <>
            {/* <ThirdwebWeb3Provider
                connectors={connectors}
                supportedChainIds={supportedChainIds}
            > */}
                <Component {...pageProps} />
            {/* </ThirdwebWeb3Provider> */}       
        </>
    )
  }
  export default MyApp