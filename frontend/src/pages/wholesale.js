import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/productExperience';

const wholesaleOptions = [
    { id: 'wholesale-5kg', name: 'Wholesale 5kg Coffee Lot', price: 5250, weight: '5kg', sku: 'WHOLE-5KG' },
    { id: 'wholesale-10kg', name: 'Wholesale 10kg Coffee Lot', price: 9800, weight: '10kg', sku: 'WHOLE-10KG' },
    { id: 'wholesale-25kg', name: 'Wholesale 25kg Coffee Lot', price: 23000, weight: '25kg', sku: 'WHOLE-25KG' },
    { id: 'wholesale-sample', name: 'Wholesale Free Sample', price: 0, weight: '100g sample', sku: 'WHOLE-SAMPLE' },
];

export default function WholesalePage() {
    const { addToCart } = useCart();
    const [submitted, setSubmitted] = useState(false);
    const [toast, setToast] = useState('');
    const [requestSample, setRequestSample] = useState(false);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleAddWholesale = option => {
        addToCart({
            id: option.id,
            slug: option.id,
            name: option.name,
            title: option.name,
            price: option.price,
            images: { hero: 'https://images.pexels.com/photos/10992757/pexels-photo-10992757.jpeg?auto=compress&cs=tinysrgb&w=1200' },
            variants: [{ weight: option.weight, priceETB: option.price, stock: 99, sku: option.sku }],
        }, 1, { weight: option.weight, priceETB: option.price, stock: 99, sku: option.sku });
        setToast(`${option.name} added to cart`);
    };

    const handleSubmit = event => {
        event.preventDefault();
        setSubmitted(true);
        if (requestSample) {
            handleAddWholesale(wholesaleOptions[3]);
        }
    };

    return (
        <Layout title="Wholesale">
            <section className="section-heading">
                <p>Wholesale / Bulk</p>
                <h2>Bulk coffee programs for cafes, hotels, and restaurants in Ethiopia.</h2>
            </section>

            <section className="limited-grid">
                <article className="story-card">
                    <div className="ritual-points">
                        <div><strong>5kg</strong><span>Starting from {formatCurrency(1050)} / kg</span></div>
                        <div><strong>10kg</strong><span>Starting from {formatCurrency(980)} / kg</span></div>
                        <div><strong>25kg</strong><span>Starting from {formatCurrency(920)} / kg</span></div>
                    </div>
                    <p>Includes sample request option, cafe onboarding, and Telebirr / CBE follow-up support.</p>
                    <div className="gift-actions">
                        {wholesaleOptions.slice(0, 3).map(option => (
                            <button key={option.id} type="button" onClick={() => handleAddWholesale(option)}>
                                Add {option.weight}
                            </button>
                        ))}
                    </div>
                    <Link href="/cart" className="text-link-button">View Cart</Link>
                </article>

                <article className="story-card">
                    {submitted ? (
                        <div className="review-form-card">
                            <p>Your wholesale inquiry is ready for follow-up.</p>
                            <Link href="/cart" className="text-link-button">Open Cart</Link>
                        </div>
                    ) : (
                        <form className="review-form-card" onSubmit={handleSubmit}>
                            <input type="text" placeholder="Name" required />
                            <input type="text" placeholder="Business" required />
                            <input type="text" placeholder="Estimated monthly kg" required />
                            <input type="tel" placeholder="Phone number" required />
                            <label className="checkbox-line">
                                <input type="checkbox" checked={requestSample} onChange={event => setRequestSample(event.target.checked)} />
                                <span>Request 100g free sample</span>
                            </label>
                            <button type="submit">Send Inquiry</button>
                        </form>
                    )}
                </article>
            </section>

            {toast ? <div className="toast-banner">{toast}</div> : null}
        </Layout>
    );
}
