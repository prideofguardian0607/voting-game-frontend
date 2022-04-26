import Button from '@mui/material/Button'
import Router from 'next/router'
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

const connectors = {
    injected: {},
}

const supportedChainIds = [4, 137, ];

const MyApp = ({ Component, pageProps }) => {
    return (
        <>
            {/* <ThirdwebWeb3Provider
                connectors={connectors}
                supportedChainIds={supportedChainIds}
            > */}
                <Component {...pageProps} />
            {/* </ThirdwebWeb3Provider> */}
            <Button sx={{position: 'absolute', bottom: 10, left: 10}} onClick={
                () => {
                    Router.back();
                }
            }> {'<<'} Back</Button>
        </>
    )
  }
  export default MyApp