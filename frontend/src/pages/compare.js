import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../utils/api';
import { enhanceProductCollection, formatCurrency } from '../utils/productExperience';

const compareAttributes = [
    { key: 'region', label: 'Region', render: product => product.region },
    { key: 'price250', label: 'Price 250g', render: product => formatCurrency(product.variants?.find(item => item.weight === '250g')?.priceETB || product.price) },
    { key: 'price500', label: 'Price 500g', render: product => formatCurrency(product.variants?.find(item => item.weight === '500g')?.priceETB || product.price) },
    { key: 'price1kg', label: 'Price 1kg', render: product => formatCurrency(product.variants?.find(item => item.weight === '1kg')?.priceETB || product.price) },
    { key: 'roast', label: 'Roast Level', render: product => product.roastLevel.label },
    { key: 'process', label: 'Process', render: product => product.process },
    { key: 'grade', label: 'Grade', render: product => product.grade },
    { key: 'elevation', label: 'Elevation', render: product => product.origin.altitude || (product.elevation ? `${product.elevation} masl` : '-') },
    { key: 'notes', label: 'Tasting Notes', render: product => product.primaryNotes.join(', ') || '-' },
    { key: 'acidity', label: 'Acidity', render: product => `${product.compareMetrics.acidity.toFixed(1)} / 5` },
    { key: 'body', label: 'Body', render: product => `${product.compareMetrics.body.toFixed(1)} / 5` },
    { key: 'sweetness', label: 'Sweetness', render: product => `${product.compareMetrics.sweetness.toFixed(1)} / 5` },
    { key: 'bitterness', label: 'Bitterness', render: product => `${product.compareMetrics.bitterness.toFixed(1)} / 5` },
    { key: 'scaScore', label: 'SCA Score', render: product => `${product.scaScore} points` },
    { key: 'rating', label: 'Rating', render: product => `${product.rating.toFixed(1)} (${product.reviewCount} reviews)` },
    { key: 'bestFor', label: 'Best For', render: product => product.bestFor.join(', ') },
    { key: 'stock', label: 'Stock Status', render: product => product.stockLabel },
];

const defaultWeights = {
    price: 60,
    flavor: 80,
    body: 40,
    acidity: 70,
    roastLevel: 30,
};

const parseIds = query => {
    const raw = query.products || query.ids || '';
    return String(raw).split(',').filter(Boolean).slice(0, 4);
};

const average = values => values.reduce((sum, value) => sum + value, 0) / (values.length || 1);

const clamp = value => Math.max(0, Math.min(100, Number(value || 0)));

const getFlavorLabel = product => {
    const floral = product.compareMetrics.floral;
    const fruity = product.compareMetrics.fruity;
    const body = product.compareMetrics.body;

    if (floral >= 4.2) return 'Floral and Citrus';
    if (fruity >= 4.1) return 'Berry and Wine';
    if (body >= 3.9) return 'Fruity and Sweet';
    return 'Balanced and Sweet';
};

const deriveBestFor = product => {
    if (product.roastLevel.percentage <= 38) return ['Pour Over', 'V60'];
    if (product.roastLevel.percentage >= 72) return ['Espresso', 'Jebena'];
    if (product.compareMetrics.body >= 3.8) return ['French Press', 'Espresso'];
    return ['Chemex', 'Batch Brew'];
};

const addComparisonData = product => {
    const wheel = product.flavorWheel || {};
    const acidity = Math.min(5, Math.max(1.5, ((wheel.citrus || 40) + (wheel.floral || 40)) / 40));
    const body = Math.min(5, Math.max(1.5, ((wheel.cacao || 35) + product.roastLevel.percentage) / 35));
    const sweetness = Math.min(5, Math.max(1.5, (wheel.sweetness || 55) / 20));
    const bitterness = Math.min(5, Math.max(1, (product.roastLevel.percentage + (wheel.spice || 20)) / 35));
    const fruity = Math.min(5, Math.max(1.5, (wheel.stoneFruit || 45) / 20));
    const floral = Math.min(5, Math.max(1.5, (wheel.floral || 40) / 20));
    const roastIntensity = Math.min(5, Math.max(1, product.roastLevel.percentage / 20));
    const scaScore = Math.max(84, Math.min(92, Math.round(84 + product.rating + floral / 2 + fruity / 3)));
    const valuePer100g = Math.round(((product.variants?.find(item => item.weight === '250g')?.priceETB || product.price) / 250) * 100);

    return {
        ...product,
        scaScore,
        flavorProfile: getFlavorLabel({ compareMetrics: { floral, fruity, body } }),
        valuePer100g,
        compareMetrics: {
            acidity,
            body,
            sweetness,
            bitterness,
            floral,
            fruity,
            roastIntensity,
        },
        bestFor: deriveBestFor({ ...product, compareMetrics: { acidity, body, sweetness, bitterness, floral, fruity, roastIntensity } }),
    };
};

export default function ComparePage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [catalog, setCatalog] = useState([]);
    const [search, setSearch] = useState('');
    const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
    const [expanded, setExpanded] = useState([]);
    const [weights, setWeights] = useState(defaultWeights);

    useEffect(() => {
        fetchProducts({ limit: 24 })
            .then(({ data }) => {
                const source = enhanceProductCollection(data.products || data).map(addComparisonData);
                setCatalog(source);
            })
            .catch(() => setCatalog([]));
    }, []);

    const selectedIds = useMemo(() => parseIds(router.query), [router.query]);

    const selectedProducts = useMemo(
        () => selectedIds.map(id => catalog.find(product => product.slug === id)).filter(Boolean).slice(0, 4),
        [catalog, selectedIds],
    );

    const searchResults = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return catalog.slice(0, 8);
        }

        return catalog.filter(product =>
            product.name.toLowerCase().includes(query)
            || product.region.toLowerCase().includes(query)
            || product.roastLevel.label.toLowerCase().includes(query)
            || product.primaryNotes.some(note => note.toLowerCase().includes(query)))
            .slice(0, 8);
    }, [catalog, search]);

    const recentlySuggested = useMemo(() => {
        const preferred = ['yirgacheffe-g1-washed', 'sidama-natural', 'guji-g1', 'harrar-longberry'];
        return preferred.map(slug => catalog.find(product => product.slug === slug)).filter(Boolean);
    }, [catalog]);

    const filteredAttributes = useMemo(() => {
        if (!showDifferencesOnly || selectedProducts.length < 2) {
            return compareAttributes;
        }

        return compareAttributes.filter(attribute => {
            const values = selectedProducts.map(product => String(attribute.render(product)));
            return new Set(values).size > 1;
        });
    }, [selectedProducts, showDifferencesOnly]);

    const comparisonSummary = useMemo(() => {
        return selectedProducts.map(product => ({
            slug: product.slug,
            title: product.name,
            summary:
                product.compareMetrics.floral >= 4.2
                    ? 'Choose this if you love floral, tea-like coffees.'
                    : product.compareMetrics.fruity >= 4.0
                        ? 'Choose this if you prefer fruity, wine-like flavors.'
                        : 'Choose this for a balanced, chocolate-friendly cup.',
        }));
    }, [selectedProducts]);

    const winners = useMemo(() => {
        if (!selectedProducts.length) {
            return {};
        }

        const priceMax = Math.max(...selectedProducts.map(product => product.valuePer100g));
        const roastTarget = weights.roastLevel / 100 * 100;

        const scored = selectedProducts.map(product => {
            const flavor = average([product.compareMetrics.floral, product.compareMetrics.fruity, product.compareMetrics.sweetness]);
            const priceScore = priceMax ? (1 - (product.valuePer100g / priceMax)) * 5 : 0;
            const roastAlignment = 5 - Math.min(5, Math.abs(product.roastLevel.percentage - roastTarget) / 20);

            const weightedScore =
                (priceScore * weights.price)
                + (flavor * weights.flavor)
                + (product.compareMetrics.body * weights.body)
                + (product.compareMetrics.acidity * weights.acidity)
                + (roastAlignment * weights.roastLevel);

            return { product, weightedScore, priceScore, flavor };
        });

        const bestOverall = [...scored].sort((a, b) => b.weightedScore - a.weightedScore)[0]?.product;
        const bestValue = [...selectedProducts].sort((a, b) => a.valuePer100g - b.valuePer100g)[0];
        const bestPourOver = [...selectedProducts].sort((a, b) => (b.compareMetrics.acidity + b.compareMetrics.floral) - (a.compareMetrics.acidity + a.compareMetrics.floral))[0];
        const bestEspresso = [...selectedProducts].sort((a, b) => (b.compareMetrics.body + b.roastLevel.percentage / 25) - (a.compareMetrics.body + a.roastLevel.percentage / 25))[0];
        const mostAwarded = [...selectedProducts].sort((a, b) => b.scaScore - a.scaScore)[0];

        return { bestOverall, bestValue, bestPourOver, bestEspresso, mostAwarded };
    }, [selectedProducts, weights]);

    const updateSelection = nextIds => {
        const cleanIds = nextIds.filter(Boolean).slice(0, 4);
        router.replace(
            {
                pathname: '/compare',
                query: cleanIds.length ? { products: cleanIds.join(',') } : {},
            },
            undefined,
            { shallow: true },
        );
    };

    const addProduct = slug => {
        if (selectedIds.includes(slug) || selectedIds.length >= 4) {
            return;
        }
        updateSelection([...selectedIds, slug]);
    };

    const removeProduct = slug => {
        updateSelection(selectedIds.filter(id => id !== slug));
        setExpanded(current => current.filter(item => item !== slug));
    };

    const updateWeight = (key, value) => {
        setWeights(current => ({ ...current, [key]: clamp(value) }));
    };

    const toggleExpanded = slug => {
        setExpanded(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
    };

    return (
        <Layout title="Compare Ethiopian Coffees">
            <section className="compare-hero-advanced">
                <div className="compare-hero-copy">
                    <span className="section-kicker">Compare Products</span>
                    <h1>Compare and find your perfect Ethiopian coffee</h1>
                    <p>Line up up to four Kaloss coffees and compare price, roast, process, flavor structure, and brewing fit side by side.</p>
                </div>
                <div className="compare-hero-art">
                    <div className="compare-bean compare-bean-light" />
                    <div className="compare-bean compare-bean-dark" />
                </div>
            </section>

            <section className="compare-selector-shell">
                <div className="compare-slot-row">
                    {[0, 1, 2, 3].map(index => {
                        const product = selectedProducts[index];
                        return (
                            <article key={index} className={`compare-slot-card ${product ? 'filled' : ''}`}>
                                {product ? (
                                    <>
                                        <img src={product.images.thumbnail} alt={product.name} />
                                        <strong>{product.name}</strong>
                                        <span>{product.region}</span>
                                        <button type="button" onClick={() => removeProduct(product.slug)}>Remove</button>
                                    </>
                                ) : (
                                    <>
                                        <strong>+ Add Product</strong>
                                        <span>Select a coffee below</span>
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
                <div className="compare-search-row">
                    <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, region, roast, or tasting note" />
                    <button type="button" onClick={() => updateSelection([])}>Clear all</button>
                </div>
                <div className="compare-product-pills">
                    {searchResults.map(product => (
                        <button key={product.slug} type="button" className="compare-product-pill" onClick={() => addProduct(product.slug)} disabled={selectedIds.includes(product.slug) || selectedIds.length >= 4}>
                            <img src={product.images.thumbnail} alt={product.name} />
                            <span>{product.name}</span>
                            <small>{formatCurrency(product.price)}</small>
                        </button>
                    ))}
                </div>
            </section>

            {selectedProducts.length < 2 ? (
                <section className="compare-empty-state">
                    <h2>Select 2 to 4 products to start comparing</h2>
                    <p>Start with bestselling Ethiopian profiles and build a side-by-side tasting shortlist.</p>
                    <div className="compare-suggestion-grid">
                        {recentlySuggested.map(product => (
                            <article key={product.slug} className="compare-suggestion-card">
                                <img src={product.images.thumbnail} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.region} | {product.roastLevel.label}</p>
                                <button type="button" onClick={() => addProduct(product.slug)}>Add to Compare</button>
                            </article>
                        ))}
                    </div>
                    <div className="about-hero-actions">
                        <Link href="/products">Browse Bestsellers</Link>
                        <Link href="/products?sortBy=latest">View New Arrivals</Link>
                    </div>
                </section>
            ) : (
                <>
                    <section className="compare-controls-panel">
                        <label className="checkbox-line">
                            <input type="checkbox" checked={showDifferencesOnly} onChange={event => setShowDifferencesOnly(event.target.checked)} />
                            <span>Show differences only</span>
                        </label>
                        <div className="compare-weight-grid">
                            {Object.entries(weights).map(([key, value]) => (
                                <label key={key} className="compare-weight-card">
                                    <span>{key}</span>
                                    <input type="range" min="0" max="100" value={value} onChange={event => updateWeight(key, event.target.value)} />
                                    <strong>{value}%</strong>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="compare-winner-grid">
                        {[
                            ['Best Overall', winners.bestOverall],
                            ['Best Value', winners.bestValue],
                            ['Best for Pour Over', winners.bestPourOver],
                            ['Best for Espresso', winners.bestEspresso],
                            ['Most Awarded', winners.mostAwarded],
                        ].map(([label, product]) => (
                            <article key={label} className="compare-winner-card">
                                <span>{label}</span>
                                <h3>{product?.name || '-'}</h3>
                                <p>{product ? `${product.region} | ${product.flavorProfile}` : 'Select more coffees to compare.'}</p>
                            </article>
                        ))}
                    </section>

                    <section className="compare-table-wrap compare-table-wrap-advanced">
                        <table className="compare-table compare-table-advanced">
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    {selectedProducts.map(product => (
                                        <th key={product.slug}>
                                            <div className="compare-product-head">
                                                <img src={product.images.thumbnail} alt={product.name} />
                                                <strong>{product.name}</strong>
                                                <span>{product.region}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Roast Visual</td>
                                    {selectedProducts.map(product => (
                                        <td key={product.slug}>
                                            <div className="compare-meter">
                                                <div style={{ width: `${product.roastLevel.percentage}%` }} />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Flavor Profile</td>
                                    {selectedProducts.map(product => <td key={product.slug}>{product.flavorProfile}</td>)}
                                </tr>
                                {filteredAttributes.map(attribute => (
                                    <tr key={attribute.key}>
                                        <td>{attribute.label}</td>
                                        {selectedProducts.map(product => (
                                            <td key={`${product.slug}-${attribute.key}`}>{attribute.render(product)}</td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <td>Actions</td>
                                    {selectedProducts.map(product => (
                                        <td key={product.slug}>
                                            <div className="compare-action-stack">
                                                <button type="button" onClick={() => addToCart(product, 1, product.variants[0])}>Add to Cart</button>
                                                <Link href={`/product/${product.slug}`}>View</Link>
                                                <button type="button" onClick={() => toggleExpanded(product.slug)}>{expanded.includes(product.slug) ? 'Hide Details' : 'Expand'}</button>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="compare-chart-grid">
                        <article className="compare-chart-card">
                            <span className="section-kicker">Roast Comparison</span>
                            {selectedProducts.map(product => (
                                <div key={product.slug} className="compare-bar-row">
                                    <strong>{product.name}</strong>
                                    <div className="compare-meter">
                                        <div style={{ width: `${product.roastLevel.percentage}%` }} />
                                    </div>
                                    <span>{product.roastLevel.percentage}%</span>
                                </div>
                            ))}
                        </article>
                        <article className="compare-chart-card">
                            <span className="section-kicker">Price Per 100g</span>
                            {selectedProducts.map(product => (
                                <div key={product.slug} className="compare-bar-row">
                                    <strong>{product.name}</strong>
                                    <div className="compare-meter value">
                                        <div style={{ width: `${Math.max(25, 100 - (product.valuePer100g / Math.max(...selectedProducts.map(item => item.valuePer100g))) * 100)}%` }} />
                                    </div>
                                    <span>{product.valuePer100g} ETB</span>
                                </div>
                            ))}
                        </article>
                        <article className="compare-chart-card">
                            <span className="section-kicker">Flavor Dimensions</span>
                            {selectedProducts.map(product => (
                                <div key={product.slug} className="compare-metric-grid">
                                    <h3>{product.name}</h3>
                                    {['acidity', 'body', 'sweetness', 'bitterness', 'floral', 'fruity'].map(metric => (
                                        <div key={metric} className="compare-metric-row">
                                            <span>{metric}</span>
                                            <div className="compare-meter subtle">
                                                <div style={{ width: `${product.compareMetrics[metric] * 20}%` }} />
                                            </div>
                                            <strong>{product.compareMetrics[metric].toFixed(1)}</strong>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </article>
                    </section>

                    <section className="compare-summary-grid">
                        {comparisonSummary.map(item => (
                            <article key={item.slug} className="compare-summary-card">
                                <h3>{item.title}</h3>
                                <p>{item.summary}</p>
                            </article>
                        ))}
                    </section>

                    <section className="compare-detail-grid">
                        {selectedProducts.filter(product => expanded.includes(product.slug)).map(product => (
                            <article key={product.slug} className="compare-detail-card">
                                <div className="section-heading">
                                    <span className="section-kicker">{product.name}</span>
                                    <h2>Expanded detail</h2>
                                </div>
                                <p>{product.description}</p>
                                <p><strong>Farmer Story:</strong> {product.farmerStory || 'Kaloss partner growers in the Ethiopian highlands.'}</p>
                                <p><strong>Brewing Guide:</strong> {product.brewingGuide || 'V60: 15g coffee, 250ml water. French press: 18g coffee, 300ml water. Jebena: slow simmer and serve in rounds.'}</p>
                                <p><strong>Best For:</strong> {product.bestFor.join(', ')}</p>
                                <div className="chip-row">
                                    {product.primaryNotes.map(note => <span key={note} className="button-chip active">{note}</span>)}
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="about-cta-banner">
                        <div>
                            <span className="section-kicker">Bundle Idea</span>
                            <h2>Add all compared coffees together and build your own Ethiopian tasting flight.</h2>
                        </div>
                        <div className="about-hero-actions">
                            <button type="button" onClick={() => selectedProducts.forEach(product => addToCart(product, 1, product.variants[0]))}>Add All To Cart</button>
                            <Link href={`/compare?products=${selectedProducts.map(product => product.slug).join(',')}`}>Share Comparison</Link>
                        </div>
                    </section>
                </>
            )}
        </Layout>
    );
}
