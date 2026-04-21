import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { cancelOrder, getOrderById } from '../../utils/api';
import { formatETB } from '../../utils/cart';

export default function OrderTrackingPage() {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) return;

        const loadOrder = async () => {
            try {
                const { data } = await getOrderById(orderId);
                setOrder(data);
            } catch (requestError) {
                setError(requestError.response?.data?.message || 'Unable to load this order.');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    const handleCancel = async () => {
        try {
            const { data } = await cancelOrder(orderId);
            setOrder(data);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to cancel this order.');
        }
    };

    return (
        <Layout title="Track Order">
            <section className="order-tracking-shell">
                {loading ? <p>Loading order...</p> : null}
                {error ? <p className="form-error">{error}</p> : null}
                {order ? (
                    <>
                        <div className="section-heading">
                            <p>Order Tracking</p>
                            <h1>{order.orderNumber}</h1>
                        </div>
                        <div className="review-summary-grid">
                            <div className="review-summary-card">
                                <span>Payment</span>
                                <strong>{order.paymentMethod}</strong>
                                <p>{order.paymentStatus}</p>
                                <p>Total {formatETB(order.summary.totalETB)}</p>
                            </div>
                            <div className="review-summary-card">
                                <span>Delivery</span>
                                <strong>{order.orderStatus}</strong>
                                <p>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                                <p>{order.deliveryOption}</p>
                            </div>
                        </div>

                        <div className="timeline-panel">
                            {(order.timeline || []).map((entry, index) => (
                                <div key={`${entry.label}-${index}`} className="timeline-entry">
                                    <strong>{entry.label}</strong>
                                    <p>{entry.detail}</p>
                                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="map-placeholder-card">
                            <strong>Courier map placeholder</strong>
                            <p>Connect your delivery partner feed here for live courier coordinates and ETA updates.</p>
                        </div>

                        <div className="checkout-actions-row">
                            <button type="button" className="secondary-dark-link button-reset" onClick={handleCancel}>Cancel Order</button>
                            <Link href={`/checkout/success?orderId=${order._id}`} className="primary-link">Download invoice</Link>
                        </div>
                    </>
                ) : null}
            </section>
        </Layout>
    );
}
