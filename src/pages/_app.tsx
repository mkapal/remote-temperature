import '../styles/global.css';
import Head from 'next/head';
import type { AppType } from 'next/app';
import { Open_Sans } from 'next/font/google';
import { useEffect } from 'react';

const openSans = Open_Sans({ subsets: ['latin', 'latin-ext'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'));
    }
  }, []);

  return (
    <main className={openSans.className} style={{ height: '100%' }}>
      <Head>
        <title>Teplota U Pahoráka</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="author" content="Martin Kapal" />
        <meta name="description" content="Teplota U Pahoráka" />
        <meta name="theme-color" content="#1e5799" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-apple-180x180.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-32x32.png"
        />
      </Head>
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
