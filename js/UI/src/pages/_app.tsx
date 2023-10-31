import type { AppProps } from 'next/app';
import { Slide, ToastContainer } from 'react-toastify';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <ToastContainer transition={Slide} />
    <Component {...pageProps} />
  </>;
}
