import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { approveAdminProduct, createAdminProduct, fetchAdminProducts, rejectAdminProduct } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/auth';

const initialForm = {
    title: '',
    region: 'Yirgacheffe',
    process: 'Washed',
    grade: 'Grade 1',
    roastLevel: { type: 'light', percentage: 30 },
    tastingNotes: 'Jasmine, Bergamot, Lemon',
    price: 450,
    variants: [{ weight: '250g', priceETB: 450, stock: 20, sku: 'NEW-250' }],
    description: '',
    status: 'pending',
};

export default function AdminProducts() {
    const { user, token, hydrated } = useAuth();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const isAdmin = ['admin', 'super_admin'].includes(user?.role || '');

    const loadProducts = () => {
        if (!hydrated || !token || !isAdmin) return;
        fetchAdminProducts().then(({ data }) => setProducts(data)).catch(() => setProducts([]));
    };

    useEffect(() => {
        loadProducts();
    }, [hydrated, token, isAdmin]);

    const handleCreate = async event => {
        event.preventDefault();
        setError('');
        try {
            await createAdminProduct(form);
            setForm(initialForm);
            loadProducts();
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to save product.');
        }
    };

    return (
        <AdminLayout title="Manage Products" heading="Products">
            <div className="admin-grid two-up admin-feature-grid">
                <section className="mini-card admin-panel-card">
                    <h3>Add Product</h3>
                    <form className="auth-form" onSubmit={handleCreate}>
                        <input value={form.title} onChange={event => setForm(previous => ({ ...previous, title: event.target.value }))} placeholder="Product name" required />
                        <div className="two-column-grid">
                            <input value={form.region} onChange={event => setForm(previous => ({ ...previous, region: event.target.value }))} placeholder="Region" />
                            <input value={form.grade} onChange={event => setForm(previous => ({ ...previous, grade: event.target.value }))} placeholder="Grade" />
                        </div>
                        <div className="two-column-grid">
                            <input type="number" value={form.price} onChange={event => setForm(previous => ({ ...previous, price: Number(event.target.value) }))} placeholder="Price ETB" />
                            <select value={form.status} onChange={event => setForm(previous => ({ ...previous, status: event.target.value }))}>
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                        <input value={form.tastingNotes} onChange={event => setForm(previous => ({ ...previous, tastingNotes: event.target.value }))} placeholder="Tasting notes" />
                        <textarea rows="4" value={form.description} onChange={event => setForm(previous => ({ ...previous, description: event.target.value }))} placeholder="Description" />
                        <button type="submit" className="auth-primary-button">Save product</button>
                        {error && <p className="form-error">{error}</p>}
                    </form>
                </section>

                <section className="mini-card admin-panel-card">
                    <h3>All Products</h3>
                    <div className="data-list">
                        {products.map(product => (
                            <article key={product._id} className="data-row stacked admin-entity-row">
                                <div>
                                    <strong>{product.title || product.name}</strong>
                                    <span>{product.region} • {formatCurrency(product.pricing?.current || product.price)} • {product.status} • {formatDate(product.updatedAt)}</span>
                                </div>
                                <div className="inline-actions">
                                    <button type="button" className="secondary-action-button" onClick={() => approveAdminProduct(product._id).then(loadProducts)}>Approve</button>
                                    <button type="button" className="text-link-button" onClick={() => rejectAdminProduct(product._id, { reason: 'Needs review.' }).then(loadProducts)}>Reject</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
