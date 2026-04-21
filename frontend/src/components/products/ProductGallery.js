import { useState } from 'react';

export default function ProductGallery({ product }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const gallery = product.images.gallery || [];

    return (
        <section className="product-gallery-shell">
            <div className="product-gallery-stage">
                <div className="gallery-orbit orbit-a" />
                <div className="gallery-orbit orbit-b" />
                {gallery[selectedImage] && (
                    <img src={gallery[selectedImage]} alt={`${product.name} view ${selectedImage + 1}`} className="product-gallery-image" />
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
    );
}
