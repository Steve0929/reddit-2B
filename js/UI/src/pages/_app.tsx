import type { AppProps } from 'next/app';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <ToastContainer transition={Slide} />
    <Component {...pageProps} />
  </>;
}
