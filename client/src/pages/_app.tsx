import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // the data we're fetching is completely static, so we never need to refetch and can cache forever
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { basePath } = useRouter();

  return (
    <>
      <Script id="theme-init" strategy="beforeInteractive">
      {`
        try {
            const theme = localStorage.getItem("theme") === "light"
            ? "light"
            : "dark";

            document.documentElement.dataset.theme = theme;
          } catch {}
        `}
      </Script>

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`} />
        <link rel="manifest" href={`${basePath}/site.webmanifest`}></link>
        <title>UTD Grades</title>
        <meta
          name="description"
          content="See how students did in any given class at UT Dallas. And it's free, forever."
        />
      </Head>

      {process.env.NODE_ENV === "production" ? (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=UA-128111650-1"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-128111650-1');
        `}
          </Script>
        </>
      ) : (
        null
      )}

      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
