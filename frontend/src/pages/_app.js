import Head from 'next/head';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

function AppProviders({ children }) {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
}

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Kaloss Coffee</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta
                    name="description"
                    content="Kaloss Coffee storefront for premium coffee, orders, and customer accounts."
                />
            </Head>
            <AppProviders>
                <Component {...pageProps} />
            </AppProviders>
        </>
    );
}

export default MyApp;
