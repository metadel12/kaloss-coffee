import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { fetchPendingAdminPayments, rejectAdminPayment, verifyAdminPayment } from '../../../utils/api';
import { formatCurrency, formatDate } from '../../../utils/auth';

export default function PendingPaymentsPage() {
    const { user, token, hydrated } = useAuth();
    const [orders, setOrders] = useState([]);
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    const loadOrders = () => {
        if (!hydrated || !token || !isAdmin) return;
        fetchPendingAdminPayments().then(({ data }) => setOrders(data)).catch(() => setOrders([]));
    };

    useEffect(() => {
        loadOrders();
    }, [hydrated, token, isAdmin]);

    return (
        <AdminLayout title="Pending Payments" heading="Payment Queue">
            <section className="mini-card admin-panel-card">
                <h3>Pending Payment Verification ({orders.length})</h3>
                <div className="data-list">
                    {orders.map(order => (
                        <article key={order._id} className="data-row stacked admin-entity-row">
                            <div>
                                <strong>{order.orderNumber} • {order.customer?.fullName}</strong>
                                <span>{formatCurrency(order.summary?.totalETB)} • {order.paymentMethod} • {formatDate(order.createdAt)}</span>
                            </div>
                            <div className="inline-actions">
                                <button type="button" className="secondary-action-button" onClick={() => verifyAdminPayment(order._id, { transactionReference: order.paymentReference }).then(loadOrders)}>Approve</button>
                                <button type="button" className="text-link-button" onClick={() => rejectAdminPayment(order._id, { reason: 'Receipt needs resubmission.' }).then(loadOrders)}>Reject</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
