import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import fetchApi from "utils/fetchApi";
import "styles/globals.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchApi,
        onError: (err: any) => console.error(err),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
};

export default App;
