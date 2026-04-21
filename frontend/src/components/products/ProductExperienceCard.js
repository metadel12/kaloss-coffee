import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getProductBackdrop } from '../../utils/productExperience';

export default function ProductExperienceCard({ product, onToggleCompare, isCompared = false, onQuickView }) {
    const { addToCart } = useCart();
    const [wishlisted, setWishlisted] = useState(false);

    return (
        <article className="experience-card product-card-upgraded">
            <div className="experience-card-media" style={getProductBackdrop(product)}>
                <div className="experience-card-glow" />
                <img src={product.images.hero} alt={product.name} className="experience-card-image" />
                <div className="experience-card-topline">
                    <span>{product.region}</span>
                    <strong>{product.grade}</strong>
                </div>
                <div className="product-card-badges">
                    <button type="button" className={`wishlist-badge ${wishlisted ? 'active' : ''}`} onClick={() => setWishlisted(previous => !previous)}>
                        {wishlisted ? 'Saved' : 'Wishlist'}
                    </button>
                    {product.lowStock ? <span className="stock-badge low">Low Stock</span> : <span className="stock-badge">In Stock</span>}
                </div>
                <div className="product-card-overlay-actions">
                    <button type="button" onClick={() => addToCart(product, 1, product.variants[0])}>Add to Cart</button>
                    <button type="button" onClick={() => onQuickView?.(product)}>Quick View</button>
                </div>
            </div>

            <div className="experience-card-body">
                <div className="experience-rating-row">
                    <span>{product.roastLevel.label}</span>
                    <strong>{product.rating.toFixed(1)} stars</strong>
                </div>

                <h3>{product.name}</h3>
                <p>{product.subRegion}, {product.region}</p>

                <div className="experience-note-row">
                    {product.primaryNotes.slice(0, 3).map(note => (
                        <span key={note}>{note}</span>
                    ))}
                </div>

                <div className="experience-card-footer">
                    <div>
                        <strong>{formatCurrency(product.price)}</strong>
                        <span>{product.reviewCount} reviews</span>
                    </div>

                    <div className="experience-card-actions">
                        <Link href={`/product/${product.slug}`}>View</Link>
                        <button type="button" onClick={() => onToggleCompare?.(product.slug)}>
                            {isCompared ? 'Compared' : 'Compare'}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
