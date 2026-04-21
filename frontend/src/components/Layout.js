import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title = 'Kaloss Coffee' }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Ethiopian Kaloss Coffee homepage with ceremony storytelling, blends, reviews, and subscriptions." />
            </Head>
            <Header />
            <main className="page-container">{children}</main>
            <Footer />
        </>
    );
}
