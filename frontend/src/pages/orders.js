import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getUserOrders } from '../utils/api';
import { formatETB } from '../utils/cart';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const { data } = await getUserOrders();
                setOrders(data);
            } catch (error) {
                console.error('Unable to load orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <Layout title="Orders">
            <section className="orders-shell">
                <div className="section-heading">
                    <p>Orders</p>
                    <h1>Track every Kaloss order in one place</h1>
                </div>

                {loading ? <p>Loading orders...</p> : null}

                {!loading && !orders.length ? (
                    <div className="checkout-empty-shell">
                        <h2>No orders yet</h2>
                        <p>Your completed checkouts will show up here with payment status, delivery timeline, and invoice access.</p>
                        <Link href="/products" className="primary-link">Start shopping</Link>
                    </div>
                ) : null}

                <div className="orders-grid">
                    {orders.map(order => (
                        <article key={order._id} className="order-card-advanced">
                            <span>{order.orderNumber}</span>
                            <h2>{formatETB(order.summary?.totalETB || 0)}</h2>
                            <p>{order.customer?.region} | {order.deliveryOption}</p>
                            <div className="order-chip-row">
                                <strong>{order.paymentStatus}</strong>
                                <strong>{order.orderStatus}</strong>
                            </div>
                            <Link href={`/orders/${order._id}`}>Track order</Link>
                        </article>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
