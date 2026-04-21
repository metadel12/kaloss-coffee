import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminOrders, rejectAdminPayment, updateAdminOrderStatus, verifyAdminPayment } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/auth';

export default function AdminOrders() {
    const { user, token, hydrated } = useAuth();
    const [orders, setOrders] = useState([]);
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    const loadOrders = () => {
        if (!hydrated || !token || !isAdmin) return;
        fetchAdminOrders().then(({ data }) => setOrders(data)).catch(() => setOrders([]));
    };

    useEffect(() => {
        loadOrders();
    }, [hydrated, token, isAdmin]);

    return (
        <AdminLayout title="Manage Orders" heading="Orders">
            <section className="mini-card admin-panel-card">
                <h3>All Orders</h3>
                <div className="data-list">
                    {orders.map(order => (
                        <article key={order._id} className="data-row stacked admin-entity-row">
                            <div>
                                <strong>{order.orderNumber} • {order.customer?.fullName}</strong>
                                <span>{formatCurrency(order.summary?.totalETB)} • {order.paymentStatus} • {order.orderStatus} • {formatDate(order.createdAt)}</span>
                            </div>
                            <div className="inline-actions">
                                <button type="button" className="secondary-action-button" onClick={() => updateAdminOrderStatus(order._id, { orderStatus: 'Processing' }).then(loadOrders)}>Mark Processing</button>
                                <button type="button" className="secondary-action-button" onClick={() => verifyAdminPayment(order._id, { transactionReference: order.paymentReference }).then(loadOrders)}>Verify Payment</button>
                                <button type="button" className="text-link-button" onClick={() => rejectAdminPayment(order._id, { reason: 'Payment rejected by admin.' }).then(loadOrders)}>Reject Payment</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
