import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/productExperience';

const gifts = [
    {
        id: 'gift-ceremony-set',
        slug: 'ethiopian-coffee-ceremony-gift-set',
        name: 'Ethiopian Coffee Ceremony Gift Set',
        price: 2500,
        original: 2800,
        description: 'Jebena, cups, 1kg coffee, and popcorn pairing.',
        variants: [{ weight: 'Gift Set', priceETB: 2500, stock: 8, sku: 'GIFT-CEREMONY' }],
        images: { hero: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    },
    {
        id: 'gift-taster-bundle',
        slug: 'taster-bundle',
        name: 'Taster Bundle',
        price: 1200,
        original: 1500,
        description: '3 x 250g from Yirgacheffe, Sidama, and Guji.',
        variants: [{ weight: 'Bundle', priceETB: 1200, stock: 14, sku: 'GIFT-TASTER' }],
        images: { hero: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    },
    {
        id: 'gift-espresso-bundle',
        slug: 'espresso-lover-bundle',
        name: 'Espresso Lover Bundle',
        price: 2800,
        original: 3200,
        description: '2 x 500g dark roast plus tamper.',
        variants: [{ weight: 'Bundle', priceETB: 2800, stock: 10, sku: 'GIFT-ESPRESSO' }],
        images: { hero: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    },
];

export default function GiftsPage() {
    const { addToCart } = useCart();
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleAddGift = gift => {
        addToCart(gift, 1, gift.variants[0]);
        setToast(`${gift.name} added to cart`);
    };

    return (
        <Layout title="Gift Sets">
            <section className="section-heading">
                <p>Gift Sets & Bundles</p>
                <h2>Ceremony-ready bundles and curated coffee gifts in ETB.</h2>
            </section>

            <div className="product-grid experience-grid">
                {gifts.map(gift => (
                    <article key={gift.name} className="story-card gift-card">
                        <img src={gift.images.hero} alt={gift.name} className="full-bleed-image" />
                        <h3>{gift.name}</h3>
                        <p>{gift.description}</p>
                        <div className="purchase-price-row">
                            <strong>{formatCurrency(gift.price)}</strong>
                            <span>{formatCurrency(gift.original)}</span>
                        </div>
                        <p>Save {formatCurrency(gift.original - gift.price)}</p>
                        <div className="gift-actions">
                            <button type="button" onClick={() => handleAddGift(gift)}>Add All to Cart</button>
                            <Link href="/cart" className="text-link-button">View Cart</Link>
                        </div>
                    </article>
                ))}
            </div>

            {toast ? <div className="toast-banner">{toast}</div> : null}
        </Layout>
    );
}
