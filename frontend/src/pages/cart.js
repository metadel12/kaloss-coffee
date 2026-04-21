import { useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { applyDiscount } from '../utils/api';
import { formatETB, FREE_SHIPPING_THRESHOLD } from '../utils/cart';

const recommendations = [
    { title: 'Yirgacheffe G1 Washed', subtitle: 'Floral, citrus, elegant', href: '/products', price: '450 ETB' },
    { title: 'Sidama Natural', subtitle: 'Berry sweetness, espresso-friendly', href: '/products', price: '790 ETB' },
    { title: 'Guji G1 Reserve', subtitle: 'Honeyed peach and wildflower', href: '/limited-edition', price: '1,700 ETB' },
    { title: 'Kaloss Gift Set', subtitle: 'Curated for gifting and ceremony', href: '/gifts', price: '1,250 ETB' },
];

export default function CartPage() {
    const {
        cart,
        savedItems,
        summary,
        checkoutState,
        updateQuantity,
        updateCartItem,
        removeFromCart,
        saveForLater,
        moveToCart,
        selectAllItems,
        toggleSelectItem,
        removeSelected,
        moveSelectedToSaved,
        clearCart,
        setDiscountCode,
        getSelectedCount,
    } = useCart();
    const [discountFeedback, setDiscountFeedback] = useState('');
    const [loadingDiscount, setLoadingDiscount] = useState(false);

    const selectedCount = getSelectedCount();
    const progress = Math.min(100, Math.round((summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    const recentlyViewed = useMemo(() => recommendations.slice(0, 4), []);

    const handleApplyDiscount = async () => {
        if (!checkoutState.discountCode) {
            setDiscountFeedback('Enter a code to apply.');
            return;
        }

        setLoadingDiscount(true);
        try {
            const { data } = await applyDiscount({
                code: checkoutState.discountCode,
                subtotal: summary.subtotal,
                shippingFee: summary.shippingFee,
            });
            setDiscountCode(data.code);
            setDiscountFeedback(data.message);
        } catch (error) {
            setDiscountFeedback(error.response?.data?.message || 'Unable to apply discount code.');
        } finally {
            setLoadingDiscount(false);
        }
    };

    if (!cart.length) {
        return (
            <Layout title="Cart">
                <section className="cart-empty-shell">
                    <div className="cart-empty-illustration">
                        <div className="cup-base" />
                        <div className="cup-steam steam-a" />
                        <div className="cup-steam steam-b" />
                        <div className="cup-steam steam-c" />
                    </div>
                    <div className="cart-empty-copy">
                        <p className="section-kicker">Cart</p>
                        <h1>Your cart is empty, but your next favorite coffee awaits!</h1>
                        <div className="cart-cta-row">
                            <Link href="/products" className="primary-link">Shop Bestsellers</Link>
                            <Link href="/limited-edition" className="secondary-dark-link">Explore New Arrivals</Link>
                            <Link href="/gifts" className="secondary-dark-link">View Gift Sets</Link>
                        </div>
                    </div>
                    <div className="cart-recommend-grid">
                        {recentlyViewed.map(product => (
                            <article key={product.title} className="cart-rec-card">
                                <span>{product.price}</span>
                                <h3>{product.title}</h3>
                                <p>{product.subtitle}</p>
                                <Link href={product.href}>View collection</Link>
                            </article>
                        ))}
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout title="Shopping Cart">
            <section className="cart-page-shell">
                <div className="section-heading">
                    <p>Shopping Cart</p>
                    <h1>Ethiopian checkout, polished for real orders</h1>
                </div>

                <div className="cart-layout-grid">
                    <div className="cart-left-column">
                        <div className="cart-toolbar">
                            <label className="checkbox-line">
                                <input
                                    type="checkbox"
                                    checked={cart.length > 0 && selectedCount === cart.length}
                                    onChange={event => selectAllItems(event.target.checked)}
                                />
                                Select all
                            </label>
                            <div className="cart-toolbar-actions">
                                <button type="button" onClick={removeSelected} disabled={!selectedCount}>Delete selected</button>
                                <button type="button" onClick={moveSelectedToSaved} disabled={!selectedCount}>Move selected to wishlist</button>
                            </div>
                        </div>

                        <div className="shipping-progress-card">
                            <div>
                                <strong>{summary.freeShippingRemaining > 0 ? `Add ${formatETB(summary.freeShippingRemaining)} more for free shipping` : 'You unlocked free shipping'}</strong>
                                <span>Standard delivery is free from {formatETB(FREE_SHIPPING_THRESHOLD)}.</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="cart-items-advanced">
                            {cart.map(item => (
                                <article key={item.cartKey} className="cart-item-card">
                                    <label className="cart-select-box">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={event => toggleSelectItem(item.cartKey, event.target.checked)}
                                        />
                                    </label>
                                    <div className="cart-item-media">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-copy">
                                        <h3>{item.name}</h3>
                                        <p>{item.variant?.weight} | {item.grade} | {item.roastLevel}</p>
                                        <span className={item.inStock ? 'stock-pill ok' : 'stock-pill low'}>{item.inStock ? 'In Stock' : 'Low Stock'}</span>
                                        <div className="cart-note-stack">
                                            <label>
                                                <span>Note to seller</span>
                                                <textarea
                                                    rows="2"
                                                    value={item.noteToSeller}
                                                    onChange={event => updateCartItem(item.cartKey, { noteToSeller: event.target.value })}
                                                    placeholder="Grind for Jebena, add a gift message..."
                                                />
                                            </label>
                                            <label className="checkbox-line">
                                                <input
                                                    type="checkbox"
                                                    checked={item.giftWrap}
                                                    onChange={event => updateCartItem(item.cartKey, { giftWrap: event.target.checked })}
                                                />
                                                Gift wrap this item (+50 ETB per bag)
                                            </label>
                                        </div>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="quantity-stepper">
                                            <button type="button" onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}>+</button>
                                        </div>
                                        <strong>{formatETB(item.price * item.quantity)}</strong>
                                        <div className="cart-inline-actions">
                                            <button type="button" onClick={() => saveForLater(item.cartKey)}>Save for later</button>
                                            <button type="button" onClick={() => removeFromCart(item.cartKey)}>Remove</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {savedItems.length ? (
                            <section className="saved-items-panel">
                                <div className="section-heading">
                                    <p>Saved</p>
                                    <h2>Saved for later</h2>
                                </div>
                                <div className="saved-item-grid">
                                    {savedItems.map(item => (
                                        <article key={item.cartKey} className="saved-item-card">
                                            <img src={item.image} alt={item.name} />
                                            <div>
                                                <h3>{item.name}</h3>
                                                <p>{item.variant?.weight} | {formatETB(item.price)}</p>
                                            </div>
                                            <button type="button" onClick={() => moveToCart(item.cartKey)}>Move back to cart</button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <aside className="cart-summary-panel">
                        <div className="summary-card-advanced">
                            <h2>Order summary</h2>
                            <div className="summary-line"><span>Subtotal</span><strong>{formatETB(summary.subtotal)}</strong></div>
                            <div className="summary-line"><span>Shipping</span><strong>{formatETB(summary.shippingFee)}</strong></div>
                            <div className="summary-line"><span>Gift wrap</span><strong>{formatETB(summary.giftWrapFee)}</strong></div>
                            <div className="summary-line"><span>VAT 15%</span><strong>{formatETB(summary.taxAmount)}</strong></div>
                            {summary.discountAmount ? <div className="summary-line discount"><span>Discount</span><strong>-{formatETB(summary.discountAmount)}</strong></div> : null}
                            <div className="summary-total-line"><span>Total</span><strong>{formatETB(summary.totalETB)}</strong></div>
                            <p className="summary-save-copy">You save {formatETB(summary.savings)} on this order.</p>

                            <div className="discount-panel">
                                <label htmlFor="discountCode">Discount code</label>
                                <div className="discount-row">
                                    <input
                                        id="discountCode"
                                        type="text"
                                        value={checkoutState.discountCode}
                                        onChange={event => setDiscountCode(event.target.value.toUpperCase())}
                                        placeholder="SAVE10 or WELCOME20"
                                    />
                                    <button type="button" onClick={handleApplyDiscount} disabled={loadingDiscount}>
                                        {loadingDiscount ? 'Applying...' : 'Apply'}
                                    </button>
                                </div>
                                {discountFeedback ? <p className="summary-helper-copy">{discountFeedback}</p> : null}
                            </div>

                            <div className="summary-actions">
                                <button type="button" onClick={() => window.location.reload()}>Update Cart</button>
                                <button type="button" onClick={clearCart}>Clear Cart</button>
                                <Link href="/checkout" className="primary-link wide">Proceed to Checkout</Link>
                            </div>
                        </div>

                        <div className="trust-badge-panel">
                            <span>Secure Payment</span>
                            <span>Free Returns within 7 days</span>
                            <span>100% Ethiopian Coffee, Roasted Fresh</span>
                            <span>24/7 Customer Support</span>
                        </div>
                    </aside>
                </div>
            </section>
        </Layout>
    );
}
