import '../styles/global.css';
import type { AppType } from 'next/app';
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({ subsets: ['latin', 'latin-ext'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={openSans.className} style={{ height: '100%' }}>
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
