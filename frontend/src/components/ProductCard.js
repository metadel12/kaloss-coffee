import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <article className="product-card">
            <div className="product-image">
                {product.image && <img src={product.image} alt={product.title} />}
            </div>
            <div>
                <h2>{product.title}</h2>
                <p>{product.price ? `$${product.price}` : 'Price unavailable'}</p>
                <div className="card-actions">
                    <Link href={`/products/${product._id || product.id}`}>
                        <button>View Details</button>
                    </Link>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </article>
    );
}
