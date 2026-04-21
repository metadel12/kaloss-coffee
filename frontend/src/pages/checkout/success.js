import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getOrderById } from '../../utils/api';
import { formatETB } from '../../utils/cart';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const { orderId, gateway } = router.query;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) return;
        getOrderById(orderId)
            .then(({ data }) => setOrder(data))
            .catch(error => console.error('Unable to load order confirmation:', error));
    }, [orderId]);

    return (
        <Layout title="Order Confirmed">
            <section className="checkout-success-shell">
                <div className="confetti-strip" />
                <p className="section-kicker">Order Confirmed</p>
                <h1>Thank you for choosing Kaloss Coffee</h1>
                {order ? (
                    <>
                        <p>Order number: {order.orderNumber}</p>
                        <p>Email confirmation sent to: {order.customer.email}</p>
                        <p>SMS confirmation sent to: {order.customer.phone}</p>
                        <div className="review-summary-card centered">
                            <strong>{formatETB(order.summary.totalETB)}</strong>
                            <p>{order.paymentMethod} | Delivery by {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            {gateway ? <p>Gateway handoff ready: {decodeURIComponent(gateway)}</p> : null}
                        </div>
                        <div className="checkout-actions-row">
                            <Link href={`/orders/${order._id}`} className="primary-link">Track order</Link>
                            <Link href="/products" className="secondary-dark-link">Continue shopping</Link>
                        </div>
                    </>
                ) : (
                    <p>Loading your confirmation...</p>
                )}
            </section>
        </Layout>
    );
}
