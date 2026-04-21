import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminDashboardStats } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/auth';

const emptyState = {
    stats: { totalSales: 0, pendingOrders: 0, pendingProducts: 0, totalUsers: 0, pendingPayments: 0 },
    charts: { dailySales: [], ordersByStatus: [], popularProducts: [], revenueByPaymentMethod: [] },
    recentActivity: [],
};

export default function AdminDashboardPage() {
    const { user, token, hydrated } = useAuth();
    const [dashboard, setDashboard] = useState(emptyState);
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    useEffect(() => {
        if (!hydrated || !token || !isAdmin) return;
        fetchAdminDashboardStats()
            .then(({ data }) => setDashboard(data))
            .catch(() => setDashboard(emptyState));
    }, [hydrated, token, isAdmin]);

    return (
        <AdminLayout title="Admin Dashboard" heading="Dashboard">
            <div className="admin-grid admin-metrics-grid">
                {[
                    { label: 'Total Sales', value: formatCurrency(dashboard.stats.totalSales), accent: 'gold' },
                    { label: 'Pending Orders', value: dashboard.stats.pendingOrders, accent: 'amber' },
                    { label: 'Pending Products', value: dashboard.stats.pendingProducts, accent: 'rust' },
                    { label: 'Total Users', value: dashboard.stats.totalUsers, accent: 'sage' },
                ].map(item => (
                    <article key={item.label} className={`mini-card admin-stat-card ${item.accent}`}>
                        <p className="auth-eyebrow">{item.label}</p>
                        <strong className="admin-stat">{item.value}</strong>
                        <span className="admin-stat-note">Live from current storefront activity</span>
                    </article>
                ))}
            </div>

            <div className="admin-grid two-up admin-feature-grid">
                <section className="mini-card admin-panel-card">
                    <h3>Quick Actions</h3>
                    <div className="admin-action-grid">
                        <Link href="/admin/products" className="secondary-action-button">Add New Product</Link>
                        <Link href="/admin/products/pending" className="secondary-action-button">Approve Products</Link>
                        <Link href="/admin/payments/pending" className="secondary-action-button">Verify Payments</Link>
                        <Link href="/admin/orders" className="secondary-action-button">Update Orders</Link>
                    </div>
                </section>

                <section className="mini-card admin-panel-card">
                    <h3>Recent Activity</h3>
                    <div className="data-list">
                        {dashboard.recentActivity.map(item => (
                            <article key={item.id} className="data-row stacked admin-activity-row">
                                <strong>{item.label}</strong>
                                <span>{formatDate(item.time)}</span>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            <div className="admin-grid two-up admin-feature-grid">
                <section className="mini-card admin-panel-card">
                    <h3>Orders by Status</h3>
                    <div className="data-list">
                        {dashboard.charts.ordersByStatus.map(item => (
                            <article key={item.name} className="data-row admin-summary-row">
                                <strong>{item.name}</strong>
                                <span>{item.value}</span>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="mini-card admin-panel-card">
                    <h3>Revenue by Payment Method</h3>
                    <div className="data-list">
                        {dashboard.charts.revenueByPaymentMethod.map(item => (
                            <article key={item.name} className="data-row admin-summary-row">
                                <strong>{item.name}</strong>
                                <span>{formatCurrency(item.revenue)}</span>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
