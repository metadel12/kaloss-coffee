import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/productExperience';

const limitedProduct = {
    id: 'limited-enkutatash-reserve',
    slug: 'enkutatash-reserve',
    name: 'Enkutatash Honey Reserve',
    title: 'Enkutatash Honey Reserve',
    region: 'Guji',
    subRegion: 'Seasonal Release',
    process: 'Honey',
    grade: 'Grade 1',
    price: 980,
    images: {
        hero: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    variants: [
        { weight: '500g', priceETB: 980, stock: 40, sku: 'ENKU-500' },
        { weight: '500g + Gift Wrap', priceETB: 1030, stock: 20, sku: 'ENKU-500-GIFT' },
    ],
};

export default function LimitedEditionPage() {
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 0, minutes: 0 });
    const [toast, setToast] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(previous => {
                const totalMinutes = (previous.days * 24 * 60) + (previous.hours * 60) + previous.minutes - 1;
                if (totalMinutes <= 0) {
                    return { days: 0, hours: 0, minutes: 0 };
                }

                return {
                    days: Math.floor(totalMinutes / (24 * 60)),
                    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
                    minutes: totalMinutes % 60,
                };
            });
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleAddLimited = variant => {
        addToCart(limitedProduct, 1, variant);
        setToast(`${limitedProduct.name} added to cart`);
    };

    return (
        <Layout title="Limited Edition">
            <section className="limited-hero">
                <div>
                    <p className="toolbar-kicker">Seasonal / Limited Edition</p>
                    <h1>Enkutatash Reserve with only 500 bags available.</h1>
                    <p>Special holiday packaging, certificate of authenticity, and optional gift wrapping for 50 ETB.</p>
                </div>
                <div className="countdown-card">
                    <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</strong>
                    <span>Days left to buy</span>
                </div>
            </section>

            <section className="limited-grid">
                <article className="story-card">
                    <img src={limitedProduct.images.hero} alt="Limited packaging" className="full-bleed-image" />
                </article>
                <article className="story-card">
                    <h2>{limitedProduct.name}</h2>
                    <p>Floral, honey-driven, and wrapped in festive Ethiopian-inspired packaging for gifting or collector shelves.</p>
                    <div className="ritual-points">
                        <div><strong>Price</strong><span>{formatCurrency(980)}</span></div>
                        <div><strong>Batch</strong><span>Only 500 bags available</span></div>
                        <div><strong>Gift Wrap</strong><span>Extra 50 ETB</span></div>
                    </div>
                    <div className="limited-action-row">
                        {limitedProduct.variants.map(variant => (
                            <button key={variant.sku} type="button" onClick={() => handleAddLimited(variant)}>
                                Add {variant.weight}
                            </button>
                        ))}
                    </div>
                    <Link href="/cart" className="text-link-button">View Cart</Link>
                </article>
            </section>

            {toast ? <div className="toast-banner">{toast}</div> : null}
        </Layout>
    );
}
