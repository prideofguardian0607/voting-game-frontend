
import { MoralisProvider } from "react-moralis";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId="rI9dOfOVGlPirwannt00pbnnDacrG1VMx5FLCbv0"
      serverUrl="https://7slqawj4i2rc.usemoralis.com:2053/server"
    >
      {<Component {...pageProps} />}
    </MoralisProvider>
  );
}

export default MyApp;