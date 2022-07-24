import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import "../styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      {!router.pathname?.includes("/login") ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default App;
