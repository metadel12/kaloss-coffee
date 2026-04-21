import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { approveAdminProduct, fetchPendingAdminProducts, rejectAdminProduct } from '../../../utils/api';
import { formatCurrency, formatDate } from '../../../utils/auth';

export default function PendingProductsPage() {
    const { user, token, hydrated } = useAuth();
    const [products, setProducts] = useState([]);
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    const loadProducts = () => {
        if (!hydrated || !token || !isAdmin) return;
        fetchPendingAdminProducts().then(({ data }) => setProducts(data)).catch(() => setProducts([]));
    };

    useEffect(() => {
        loadProducts();
    }, [hydrated, token, isAdmin]);

    return (
        <AdminLayout title="Pending Product Approvals" heading="Product Queue">
            <section className="mini-card admin-panel-card">
                <h3>Pending Product Approvals ({products.length})</h3>
                <div className="data-list">
                    {products.map(product => (
                        <article key={product._id} className="data-row stacked admin-entity-row">
                            <div>
                                <strong>{product.title || product.name}</strong>
                                <span>{product.region} • {formatCurrency(product.pricing?.current || product.price)} • Submitted {formatDate(product.submittedAt || product.createdAt)}</span>
                            </div>
                            <div className="inline-actions">
                                <button type="button" className="secondary-action-button" onClick={() => approveAdminProduct(product._id).then(loadProducts)}>Approve</button>
                                <button type="button" className="text-link-button" onClick={() => rejectAdminProduct(product._id, { reason: 'Needs revision before publishing.' }).then(loadProducts)}>Reject</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
