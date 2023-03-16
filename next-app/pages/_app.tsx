// import '@/styles/globals.css';
import '@/styles/v2.css';

import type { AppProps } from 'next/app';
import 'numeral/locales/vi';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Toaster />
            <Component {...pageProps} />
        </Provider>
    );
}
