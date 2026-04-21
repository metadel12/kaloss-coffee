import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductExperienceCard from '../../components/products/ProductExperienceCard';
import { useCart } from '../../context/CartContext';
import { createProductReview, fetchProductById } from '../../utils/api';
import { enhanceProduct, enhanceProductCollection, formatCurrency, normalizeReview } from '../../utils/productExperience';

const tabOptions = ['Description', 'Brewing Guide', 'Farmer Story', 'Reviews'];

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [reviewForm, setReviewForm] = useState({ username: '', title: '', rating: 5, comment: '' });

    useEffect(() => {
        if (!id) return;

        const loadProduct = async () => {
            setLoading(true);

            try {
                const { data } = await fetchProductById(id);
                const enhanced = enhanceProduct(data.product || data);
                setProduct(enhanced);
                setRelatedProducts(enhanceProductCollection(data.relatedProducts || []));
                setReviews((data.reviews || []).map(normalizeReview));
                setSelectedImage(0);
                setSelectedVariantIndex(0);

                if (typeof window !== 'undefined') {
                    const existing = JSON.parse(localStorage.getItem('recentlyViewedKaloss') || '[]');
                    const next = [enhanced, ...existing.filter(item => item.slug !== enhanced.slug)].slice(0, 4);
                    localStorage.setItem('recentlyViewedKaloss', JSON.stringify(next));
                }
            } catch (error) {
                setProduct(null);
                setRelatedProducts([]);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(''), 2800);
        return () => clearTimeout(timer);
    }, [toast]);

    const selectedVariant = product?.variants?.[selectedVariantIndex];
    const currentPrice = selectedVariant?.priceETB || product?.price || 0;
    const gallery = product?.images?.gallery || [];
    const mapUrl = product ? `https://www.google.com/maps/search/${encodeURIComponent(`${product.subRegion} ${product.region}`)}` : '#';

    const roastWidth = useMemo(() => `${product?.roastLevel?.percentage || 0}%`, [product]);

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addToCart(product, quantity, selectedVariant);
        setToast(`Added ${quantity} x ${product.name} (${selectedVariant.weight}) to cart`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
    };

    const handleReviewSubmit = async event => {
        event.preventDefault();
        if (!product) return;

        try {
            const { data } = await createProductReview(product.id, reviewForm);
            setReviews(previous => [normalizeReview(data), ...previous]);
            setReviewForm({ username: '', title: '', rating: 5, comment: '' });
            setToast('Review added');
            setActiveTab('Reviews');
        } catch (error) {
            setToast('Review could not be saved');
        }
    };

    return (
        <Layout title={product ? `${product.name} | Kaloss Coffee` : 'Kaloss Coffee Product'}>
            {loading ? (
                <section className="product-detail-loading">
                    <div className="product-detail-shell">
                        <div className="product-gallery-shell skeleton-card" />
                        <div className="product-info-column skeleton-card" />
                    </div>
                </section>
            ) : product ? (
                <div className="product-page product-page-advanced">
                    <nav className="breadcrumb-row">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/products">Products</Link>
                        <span>/</span>
                        <span>{product.name}</span>
                    </nav>

                    <section className="product-detail-shell product-detail-shell-upgraded">
                        <section className="product-gallery-shell product-gallery-shell-upgraded">
                            <div className="product-gallery-stage product-gallery-stage-upgraded">
                                {gallery[selectedImage] && (
                                    <div className="zoom-frame">
                                        <img src={gallery[selectedImage]} alt={`${product.name} view ${selectedImage + 1}`} className="product-gallery-image" />
                                    </div>
                                )}
                            </div>

                            <div className="product-gallery-thumbs">
                                {gallery.map((image, index) => (
                                    <button
                                        type="button"
                                        key={`${product.slug}-${index}`}
                                        className={index === selectedImage ? 'active' : ''}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="product-info-column product-info-column-upgraded">
                            <div className="product-purchase-card product-purchase-card-upgraded">
                                <p className="toolbar-kicker">{product.region} / {product.subRegion}</p>
                                <h1>{product.name} - Ethiopia</h1>
                                <p className="product-hero-description">{product.headline}</p>

                                <div className="detail-meta-grid">
                                    <div><span>Farm</span><strong>{product.subRegion}, {product.region}</strong></div>
                                    <div><span>Elevation</span><strong>{product.origin.altitude}</strong></div>
                                    <div><span>Varietal</span><strong>{product.varietal}</strong></div>
                                    <div><span>Process</span><strong>{product.process}</strong></div>
                                    <div><span>Grade</span><strong>{product.grade}</strong></div>
                                    <div><span>Freshness</span><strong>Roasted to order, ships within 24hrs</strong></div>
                                </div>

                                <div className="experience-note-row">
                                    {product.primaryNotes.map(note => <span key={note}>{note}</span>)}
                                </div>

                                <div className="purchase-price-row purchase-price-row-upgraded">
                                    <div>
                                        <strong>{formatCurrency(currentPrice)}</strong>
                                        <p>{product.rating.toFixed(1)} stars ({product.reviewCount} reviews)</p>
                                    </div>
                                    <span className={`stock-chip ${product.lowStock ? 'low' : ''}`}>{product.stockLabel}</span>
                                </div>

                                <div className="variant-picker">
                                    {product.variants.map((variant, index) => (
                                        <button
                                            type="button"
                                            key={variant.sku}
                                            className={index === selectedVariantIndex ? 'active' : ''}
                                            onClick={() => setSelectedVariantIndex(index)}
                                        >
                                            <strong>{variant.weight}</strong>
                                            <span>{formatCurrency(variant.priceETB)}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="roast-progress">
                                    <div className="roast-progress-head">
                                        <span>Roast Level</span>
                                        <strong>{product.roastLevel.label}</strong>
                                    </div>
                                    <div className="roast-progress-track">
                                        <div className="roast-progress-fill" style={{ width: roastWidth }} />
                                    </div>
                                </div>

                                <div className="quantity-stepper">
                                    <button type="button" onClick={() => setQuantity(current => Math.max(1, current - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button type="button" onClick={() => setQuantity(current => current + 1)}>+</button>
                                </div>

                                <div className="purchase-actions purchase-actions-upgraded">
                                    <button type="button" onClick={handleAddToCart} disabled={!product.inStock}>Add to Cart</button>
                                    <button type="button" className="secondary-action-button" onClick={handleBuyNow} disabled={!product.inStock}>Buy Now</button>
                                </div>

                                <div className="subscription-banner">
                                    <strong>Save 15% with subscription</strong>
                                    <span>Choose weekly or monthly delivery on your next step.</span>
                                </div>

                                <div className="share-row">
                                    <a href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noreferrer">Telegram</a>
                                    <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                                    <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                                    <a href={mapUrl} target="_blank" rel="noreferrer">Map Link</a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="tabbed-section">
                        <div className="tab-row">
                            {tabOptions.map(tab => (
                                <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'Description' && (
                            <div className="tab-panel">
                                <p>{product.description}</p>
                                <div className="ritual-points">
                                    {product.farmerHighlights.map(point => (
                                        <div key={point}>
                                            <strong>Kaloss Note</strong>
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Brewing Guide' && (
                            <div className="tab-panel">
                                <div className="brew-guide-grid">
                                    <div className="brew-guide-card"><strong>V60</strong><span>Bright and articulate.</span></div>
                                    <div className="brew-guide-card"><strong>French Press</strong><span>More body and sweetness.</span></div>
                                    <div className="brew-guide-card"><strong>Espresso</strong><span>Dense texture and syrup.</span></div>
                                    <div className="brew-guide-card"><strong>Jebena</strong><span>Traditional, ceremonial, shared.</span></div>
                                </div>
                                <p>{product.brewingGuide}</p>
                            </div>
                        )}

                        {activeTab === 'Farmer Story' && (
                            <div className="tab-panel">
                                <p>{product.farmerStory}</p>
                                <div className="farmer-story-visuals">
                                    {gallery.slice(0, 3).map(image => <img key={image} src={image} alt={`${product.name} farm story`} />)}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="tab-panel reviews-panel">
                                <form className="review-form-card" onSubmit={handleReviewSubmit}>
                                    <h3>Add a review</h3>
                                    <input type="text" placeholder="Your name" value={reviewForm.username} onChange={event => setReviewForm(current => ({ ...current, username: event.target.value }))} />
                                    <input type="text" placeholder="Review title" value={reviewForm.title} onChange={event => setReviewForm(current => ({ ...current, title: event.target.value }))} />
                                    <select value={reviewForm.rating} onChange={event => setReviewForm(current => ({ ...current, rating: Number(event.target.value) }))}>
                                        {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} Stars</option>)}
                                    </select>
                                    <textarea rows="4" placeholder="Tell us how it brewed for you" value={reviewForm.comment} onChange={event => setReviewForm(current => ({ ...current, comment: event.target.value }))} />
                                    <button type="submit">Submit Review</button>
                                </form>

                                <div className="review-stack">
                                    {reviews.map(review => (
                                        <article key={review.id} className="detail-review-card">
                                            <div className="detail-review-head">
                                                <strong>{review.title}</strong>
                                                <span>{'★'.repeat(review.rating)}</span>
                                            </div>
                                            <p>{review.comment}</p>
                                            <small>{review.username} {review.verifiedPurchase ? '• Verified Purchase' : ''}</small>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {relatedProducts.length > 0 && (
                        <section className="related-section">
                            <div className="section-heading">
                                <p>You May Also Like</p>
                                <h2>Related coffees from the same region or roast family.</h2>
                            </div>
                            <div className="product-grid experience-grid">
                                {relatedProducts.map(item => (
                                    <ProductExperienceCard key={item.id} product={item} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <section className="product-empty-state">
                    <h1>Product not found</h1>
                    <p>The coffee you are looking for is unavailable right now.</p>
                    <Link href="/products">Return to products</Link>
                </section>
            )}

            {toast ? <div className="toast-banner">{toast}</div> : null}
        </Layout>
    );
}
