import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function CheckoutFailedPage() {
    const router = useRouter();
    const { orderId } = router.query;

    return (
        <Layout title="Payment Failed">
            <section className="checkout-failed-shell">
                <p className="section-kicker">Payment Failed</p>
                <h1>We could not complete your payment</h1>
                <p>The issue may be insufficient funds, gateway timeout, or a banking interruption. Your cart can still be recovered.</p>
                <div className="checkout-actions-row">
                    <Link href="/checkout" className="primary-link">Retry payment</Link>
                    <Link href="/cart" className="secondary-dark-link">Try a different method</Link>
                    {orderId ? <Link href={`/orders/${orderId}`} className="secondary-dark-link">Contact support</Link> : null}
                </div>
            </section>
        </Layout>
    );
}
