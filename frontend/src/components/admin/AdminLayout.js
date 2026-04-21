import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../Layout';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/products/pending', label: 'Product Queue' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/payments/pending', label: 'Payment Queue' },
    { href: '/admin/users', label: 'Users' },
];

export default function AdminLayout({ title, heading, children }) {
    const router = useRouter();
    const { user, token, hydrated, logout } = useAuth();
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    useEffect(() => {
        if (!hydrated) return;
        if (!token) {
            router.replace(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }
        if (!isAdmin) {
            router.replace('/403');
        }
    }, [hydrated, token, isAdmin, router]);

    if (!hydrated || !token || !isAdmin) {
        return (
            <Layout title={title}>
                <div className="profile-loading-state">Loading admin access...</div>
            </Layout>
        );
    }

    return (
        <Layout title={title}>
            <section className="admin-shell">
                <aside className="admin-sidebar">
                    <div className="admin-brand-block">
                        <p className="auth-eyebrow">Kaloss Admin</p>
                        <h1>{heading}</h1>
                        <p className="admin-sidebar-copy">Monitor products, approvals, payments, and customer activity from one Ethiopian coffee control room.</p>
                    </div>
                    <nav className="admin-nav">
                        {adminLinks.map(link => (
                            <Link key={link.href} href={link.href} className={`admin-nav-link ${router.pathname === link.href ? 'active' : ''}`}>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="admin-sidebar-card">
                        <span>Live Ops</span>
                        <strong>Storefront + approvals synced</strong>
                        <p>Use the queue pages to publish products and verify payments without leaving the dashboard.</p>
                    </div>
                </aside>
                <div className="admin-main">
                    <div className="admin-topbar">
                        <div className="admin-topbar-copy">
                            <p className="auth-eyebrow">Control Center</p>
                            <strong>{user?.fullName || user?.name || 'Admin'}</strong>
                            <span>{user?.role || 'admin'}</span>
                        </div>
                        <button type="button" className="secondary-action-button" onClick={logout}>Logout</button>
                    </div>
                    <div className="admin-content">{children}</div>
                </div>
            </section>
        </Layout>
    );
}
