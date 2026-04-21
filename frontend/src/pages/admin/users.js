import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { banAdminUser, fetchAdminUsers, unbanAdminUser, updateAdminUserRole } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/auth';

export default function AdminUsers() {
    const { user, token, hydrated } = useAuth();
    const [users, setUsers] = useState([]);
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    const loadUsers = () => {
        if (!hydrated || !token || !isAdmin) return;
        fetchAdminUsers().then(({ data }) => setUsers(data)).catch(() => setUsers([]));
    };

    useEffect(() => {
        loadUsers();
    }, [hydrated, token, isAdmin]);

    return (
        <AdminLayout title="Manage Users" heading="Users">
            <section className="mini-card admin-panel-card">
                <h3>All Users</h3>
                <div className="data-list">
                    {users.map(user => (
                        <article key={user._id} className="data-row stacked admin-entity-row">
                            <div>
                                <strong>{user.fullName || user.name} • {user.role}</strong>
                                <span>{user.email} • {user.banned ? 'Banned' : 'Active'} • {user.ordersCount || 0} orders • {formatCurrency(user.totalSpent || 0)} • Joined {formatDate(user.createdAt)}</span>
                            </div>
                            <div className="inline-actions">
                                <button type="button" className="secondary-action-button" onClick={() => updateAdminUserRole(user._id, { role: 'admin' }).then(loadUsers)}>Make Admin</button>
                                {user.banned ? (
                                    <button type="button" className="secondary-action-button" onClick={() => unbanAdminUser(user._id).then(loadUsers)}>Unban</button>
                                ) : (
                                    <button type="button" className="text-link-button" onClick={() => banAdminUser(user._id, { reason: 'Restricted by admin review.' }).then(loadUsers)}>Ban</button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
