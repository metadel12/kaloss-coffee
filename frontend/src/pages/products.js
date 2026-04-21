import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductExperienceCard from '../components/products/ProductExperienceCard';
import ProductFiltersBar from '../components/products/ProductFiltersBar';
import { fetchProductRegions, fetchProducts } from '../utils/api';
import { enhanceProductCollection, formatCurrency } from '../utils/productExperience';

const defaultFilters = {
    region: '',
    roastLevel: '',
    process: '',
    grade: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'featured',
    page: 1,
};

export default function Products() {
    const router = useRouter();
    const [filters, setFilters] = useState(defaultFilters);
    const [products, setProducts] = useState([]);
    const [regions, setRegions] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [quickView, setQuickView] = useState(null);
    const [compared, setCompared] = useState([]);

    useEffect(() => {
        if (!router.isReady) return;

        setFilters(current => ({
            ...current,
            ...Object.fromEntries(Object.entries(router.query).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])),
            page: Number(router.query.page || 1),
        }));
    }, [router.isReady]);

    useEffect(() => {
        fetchProductRegions()
            .then(({ data }) => setRegions(data))
            .catch(() => setRegions([]));
    }, []);

    useEffect(() => {
        const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined));
        router.replace({ pathname: '/products', query: params }, undefined, { shallow: true });

        const loadProducts = async () => {
            setLoading(true);

            try {
                const { data } = await fetchProducts({ ...filters, limit: 6 });
                const collection = enhanceProductCollection(data.products || data);
                setProducts(collection);
                setPagination(data.pagination || { total: collection.length, page: 1, totalPages: 1 });
            } catch (error) {
                setProducts([]);
                setPagination({ total: 0, page: 1, totalPages: 1 });
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [filters]);

    const activeCompareProducts = useMemo(() => products.filter(product => compared.includes(product.slug)), [products, compared]);

    const toggleCompare = slug => {
        setCompared(previous => previous.includes(slug)
            ? previous.filter(item => item !== slug)
            : previous.length >= 4
                ? [...previous.slice(1), slug]
                : [...previous, slug]);
    };

    return (
        <Layout title="Kaloss Coffee Collection">
            <section className="product-collection-hero product-collection-hero-ethiopian">
                <div className="collection-hero-copy">
                    <p className="toolbar-kicker">Explore Our Premium Ethiopian Coffees</p>
                    <h1>Single-origin Ethiopian coffees with ETB pricing, layered filters, and ritual-first detail.</h1>
                    <p>
                        Browse Yirgacheffe, Sidama, Guji, Harrar, Limu, and Jimma through roast level,
                        process, grade, and price so customers can move from curiosity to checkout quickly.
                    </p>
                    <div className="collection-stat-row">
                        <span>200 ETB - 5000+ ETB</span>
                        <span>Washed, Natural, Honey</span>
                        <span>Quick view + compare</span>
                    </div>
                </div>

                <div className="collection-hero-art collection-hero-art-landscape">
                    <div className="landscape-card landscape-card-one" />
                    <div className="landscape-card landscape-card-two" />
                    <div className="landscape-card landscape-card-three" />
                </div>
            </section>

            <ProductFiltersBar filters={filters} setFilters={setFilters} count={pagination.total} regions={regions} />

            {activeCompareProducts.length > 1 && (
                <section className="compare-banner">
                    <div>
                        <p className="toolbar-kicker">Compare selection</p>
                        <h2>{activeCompareProducts.length} coffees ready to compare</h2>
                    </div>
                    <a href={`/compare?ids=${activeCompareProducts.map(product => product.slug).join(',')}`}>Open Comparison</a>
                </section>
            )}

            {loading ? (
                <div className="product-grid experience-grid">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="experience-card skeleton-card" />
                    ))}
                </div>
            ) : (
                <div className="product-grid experience-grid">
                    {products.map(product => (
                        <ProductExperienceCard
                            key={product.id}
                            product={product}
                            onToggleCompare={toggleCompare}
                            isCompared={compared.includes(product.slug)}
                            onQuickView={setQuickView}
                        />
                    ))}
                </div>
            )}

            <section className="pagination-row">
                <button type="button" disabled={pagination.page <= 1} onClick={() => setFilters(current => ({ ...current, page: current.page - 1 }))}>
                    Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => setFilters(current => ({ ...current, page: current.page + 1 }))}>
                    Next
                </button>
            </section>

            {quickView && (
                <div className="quick-view-overlay" role="dialog" aria-modal="true">
                    <div className="quick-view-card">
                        <button type="button" className="quick-view-close" onClick={() => setQuickView(null)}>Close</button>
                        <img src={quickView.images.hero} alt={quickView.name} />
                        <div className="quick-view-copy">
                            <p className="toolbar-kicker">{quickView.region}</p>
                            <h2>{quickView.name}</h2>
                            <p>{quickView.headline}</p>
                            <div className="experience-note-row">
                                {quickView.primaryNotes.map(note => <span key={note}>{note}</span>)}
                            </div>
                            <strong>{formatCurrency(quickView.price)}</strong>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
