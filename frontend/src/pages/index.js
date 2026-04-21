import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { createReview, fetchHomepageData, subscribeNewsletter } from '../utils/api';

const fallbackData = {
    hero: {
        title: 'Kaloss Coffee - የኢትዮጵያ እውነተኛ ጣዕም',
        subtitle: 'Handpicked Arabica from Yirgacheffe, Sidama, Guji, Limu, and Harrar.',
        backgroundImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
    },
    products: [],
    reviews: [],
    ceremonySteps: [],
    galleryFeed: [],
    stats: {
        yearsOfHeritage: { value: 87, suffix: '+' },
        cupsServed: { value: 1250000, suffix: '+' },
        farmsPartnered: { value: 36, suffix: '' },
    },
    hashtags: ['#EthiopianKaloss', '#BunaTetu', '#AddisCoffeeCulture'],
};

const copy = {
    en: {
        heroEyebrow: 'Authentic Ethiopian coffee culture',
        blends: 'Signature Ethiopian Blends',
        ceremony: 'Traditional Coffee Ceremony',
        reviews: 'Community Reviews',
        gallery: 'Visual Feed',
        subscribe: 'Ethiopian Coffee Subscription',
        primaryCta: 'Explore Our Blends',
        secondaryCta: 'Experience Ceremony',
        reviewCta: 'Write a review',
        subscribeCta: 'Subscribe',
        themeLight: 'Light',
        themeDark: 'Dark',
        currencyEtb: 'ETB',
        currencyUsd: 'USD',
    },
    am: {
        heroEyebrow: 'የኢትዮጵያ እውነተኛ የቡና ባህል',
        blends: 'የኢትዮጵያ ልዩ ቅርጸ ጣዕሞች',
        ceremony: 'የባህላዊ ቡና ሥነ ሥርዓት',
        reviews: 'የደንበኞች አስተያየቶች',
        gallery: 'የምስል ማሳያ',
        subscribe: 'የቡና ምዝገባ',
        primaryCta: 'ቅርጾቻችንን ይመልከቱ',
        secondaryCta: 'ሥነ ሥርዓቱን ይለማመዱ',
        reviewCta: 'አስተያየት ይጻፉ',
        subscribeCta: 'ተመዝገብ',
        themeLight: 'ብርሃን',
        themeDark: 'ጨለማ',
        currencyEtb: 'ብር',
        currencyUsd: 'USD',
    },
};

const exchangeRate = 56.5;
const defaultCoffeeImages = [
    'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const numberFormatter = value => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }

    return `${value}`;
};

export default function Home() {
    const { user } = useAuth();
    const [homepageData, setHomepageData] = useState(fallbackData);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [currency, setCurrency] = useState('ETB');
    const [currentReview, setCurrentReview] = useState(0);
    const [toast, setToast] = useState('');
    const [subscribeForm, setSubscribeForm] = useState({ contact: '', location: 'Addis Ababa' });
    const [reviewForm, setReviewForm] = useState({
        username: '',
        rating: 5,
        comment: '',
        location: 'Addis Ababa',
        language: 'en',
    });

    useEffect(() => {
        let active = true;

        fetchHomepageData()
            .then(({ data }) => {
                if (!active) return;
                setHomepageData({
                    ...fallbackData,
                    ...data,
                });
                setLoadError('');
            })
            .catch(() => {
                if (!active) return;
                setLoadError('Showing curated fallback content while the live API reconnects.');
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!homepageData.reviews.length) {
            return undefined;
        }

        const timer = setInterval(() => {
            setCurrentReview(previous => (previous + 1) % homepageData.reviews.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [homepageData.reviews]);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timer = setTimeout(() => setToast(''), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    const dictionary = copy[language];
    const featuredBlends = homepageData.products.slice(0, 3);
    const activeReview = homepageData.reviews[currentReview] || homepageData.reviews[0];
    const heroShowcaseImages = [
        featuredBlends[0]?.image || defaultCoffeeImages[0],
        featuredBlends[1]?.image || defaultCoffeeImages[1],
        featuredBlends[2]?.image || defaultCoffeeImages[2],
    ];
    const heroBackgroundImage = homepageData.hero.backgroundImage || defaultCoffeeImages[0];

    const formatPrice = price => {
        if (currency === 'USD') {
            return `$${(price / exchangeRate).toFixed(2)}`;
        }

        return `ETB ${Number(price).toLocaleString()}`;
    };

    const getProductImage = (product, index) => product?.image || product?.images?.hero || defaultCoffeeImages[index % defaultCoffeeImages.length];
    const getGalleryImage = (item, index) => item?.image || defaultCoffeeImages[index % defaultCoffeeImages.length];
    const formatElevation = elevation => elevation || 'Highland grown';
    const formatRoastDate = roastDate => roastDate || 'Roasted this week';
    const handleImageError = (event, fallback) => {
        if (event.currentTarget.dataset.fallbackApplied === 'true') {
            return;
        }

        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = fallback;
    };

    const handleSubscribe = async event => {
        event.preventDefault();

        const payload = subscribeForm.contact.includes('@')
            ? { email: subscribeForm.contact, location: subscribeForm.location }
            : { phoneNumber: subscribeForm.contact, location: subscribeForm.location };

        try {
            const { data } = await subscribeNewsletter(payload);
            setToast(data.message || 'እንኳን ደህና መጡ! (Welcome!)');
            setSubscribeForm({ contact: '', location: subscribeForm.location });
        } catch (error) {
            setToast(error.response?.data?.message || 'Subscription could not be saved right now.');
        }
    };

    const handleReviewSubmit = async event => {
        event.preventDefault();

        try {
            const { data } = await createReview(reviewForm);
            setHomepageData(previous => ({
                ...previous,
                reviews: [data, ...previous.reviews].slice(0, 5),
            }));
            setToast(language === 'am' ? 'አስተያየትዎ ተቀባይነት አግኝቷል።' : 'Your review is now live.');
            setReviewForm({
                username: '',
                rating: 5,
                comment: '',
                location: 'Addis Ababa',
                language: reviewForm.language,
            });
            setCurrentReview(0);
        } catch (error) {
            setToast(error.response?.data?.message || 'Review could not be saved.');
        }
    };

    return (
        <Layout title="Kaloss Coffee | Ethiopian Homepage">
            <div className={`ethiopian-home theme-${theme}`}>
                <section className="ethiopian-hero" style={{ '--hero-image': `url(${heroBackgroundImage})` }}>
                    <div className="ethiopian-hero-overlay" />
                    <div className="ethiopian-hero-copy">
                        <div className="ethiopian-toolbar">
                            <span>{dictionary.heroEyebrow}</span>
                            <div className="ethiopian-toolbar-controls">
                                <div className="toggle-group">
                                    <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
                                    <button type="button" className={language === 'am' ? 'active' : ''} onClick={() => setLanguage('am')}>AM</button>
                                </div>
                                <div className="toggle-group">
                                    <button type="button" className={currency === 'ETB' ? 'active' : ''} onClick={() => setCurrency('ETB')}>{dictionary.currencyEtb}</button>
                                    <button type="button" className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>{dictionary.currencyUsd}</button>
                                </div>
                                <div className="toggle-group">
                                    <button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>{dictionary.themeLight}</button>
                                    <button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>{dictionary.themeDark}</button>
                                </div>
                            </div>
                        </div>
                        <p className="ethiopian-kicker">Kaloss Coffee</p>
                        <h1>{homepageData.hero.title}</h1>
                        <p className="ethiopian-subtitle">{homepageData.hero.subtitle}</p>
                        <div className="ethiopian-hero-actions">
                            <Link href="/products" className="primary-link">{dictionary.primaryCta}</Link>
                            <a href="#ceremony" className="secondary-link">{dictionary.secondaryCta}</a>
                        </div>
                        {!user ? (
                            <div className="hero-auth-row">
                                <Link href="/login" className="hero-auth-link hero-auth-login">Login</Link>
                                <Link href="/register" className="hero-auth-link hero-auth-register">Sign Up</Link>
                            </div>
                        ) : (
                            <div className="hero-auth-row">
                                <Link href="/profile" className="hero-auth-link hero-auth-register">My Account</Link>
                            </div>
                        )}
                        <div className="ethiopian-stats">
                            <article>
                                <strong>{numberFormatter(homepageData.stats.yearsOfHeritage.value)}{homepageData.stats.yearsOfHeritage.suffix}</strong>
                                <span>Years of heritage</span>
                            </article>
                            <article>
                                <strong>{numberFormatter(homepageData.stats.cupsServed.value)}{homepageData.stats.cupsServed.suffix}</strong>
                                <span>Cups served in Ethiopia</span>
                            </article>
                            <article>
                                <strong>{numberFormatter(homepageData.stats.farmsPartnered.value)}</strong>
                                <span>Farm partners</span>
                            </article>
                        </div>
                        {loadError ? <p className="ethiopian-status">{loadError}</p> : null}
                        {loading ? <p className="ethiopian-status">Loading live Ethiopian coffee stories...</p> : null}
                    </div>

                    <div className="ethiopian-hero-visual">
                        <div className="hero-showcase-grid">
                            {heroShowcaseImages.map((image, index) => (
                                <article key={`${image}-${index}`} className={`hero-showcase-card hero-showcase-${index + 1}`}>
                                    <img
                                        src={image}
                                        alt={`Featured Kaloss coffee ${index + 1}`}
                                        loading="lazy"
                                        onError={event => handleImageError(event, defaultCoffeeImages[index % defaultCoffeeImages.length])}
                                    />
                                </article>
                            ))}
                        </div>
                        <div className="ethiopian-pattern-card">
                            <p>Traditional ceremony</p>
                            <strong>Bole, Addis Ababa</strong>
                            <span>Green highlands, clay Jebena, warm hospitality.</span>
                        </div>
                    </div>
                </section>

                <section className="ethiopian-section">
                    <div className="section-heading">
                        <p>{dictionary.blends}</p>
                        <h2>Yirgacheffe, Sidama, and Guji lead the collection.</h2>
                    </div>
                    <div className="blend-grid">
                        {featuredBlends.map((product, index) => (
                            <article key={product.id} className="blend-card">
                                <div className="blend-image-wrap">
                                    <img
                                        src={getProductImage(product, index)}
                                        alt={product.name}
                                        loading="lazy"
                                        onError={event => handleImageError(event, defaultCoffeeImages[index % defaultCoffeeImages.length])}
                                    />
                                    <span className="blend-grade">{product.grade}</span>
                                    <div className="blend-pattern" />
                                </div>
                                <div className="blend-body">
                                    <div className="blend-meta">
                                        <span>{product.region}</span>
                                        <strong>{formatElevation(product.elevation)}</strong>
                                    </div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className="note-row">
                                        {product.tastingNotes.map(note => <span key={note}>{note}</span>)}
                                    </div>
                                    <div className="blend-foot">
                                        <div>
                                            <small>Roast date</small>
                                            <strong>{formatRoastDate(product.roastDate)}</strong>
                                        </div>
                                        <div>
                                            <small>Price</small>
                                            <strong>{formatPrice(product.pricing.current)}</strong>
                                        </div>
                                    </div>
                                    <Link href={`/products/${product.slug || product.id}`} className="text-link-button">View Details</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="ceremony" className="ethiopian-section ceremony-section">
                    <div className="section-heading">
                        <p>{dictionary.ceremony}</p>
                        <h2>The ceremony moves from aroma to hospitality, one deliberate step at a time.</h2>
                    </div>
                    <div className="ceremony-layout">
                        <div className="ceremony-backdrop">
                            <div className="ceremony-image-card">
                                <img
                                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80"
                                    alt="Coffee ceremony inspired backdrop"
                                    loading="lazy"
                                />
                            </div>
                            <div className="music-card">
                                <span>Eskista rhythm option</span>
                                <strong>Ambient ceremony mode</strong>
                                <p>Add a local `public/audio/eskista-rhythm.mp3` track to turn this into live playback.</p>
                            </div>
                        </div>
                        <div className="ceremony-timeline">
                            {homepageData.ceremonySteps.map(step => (
                                <article key={step.id} className="timeline-step">
                                    <span>{step.amharicName}</span>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    <strong>{step.accent}</strong>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ethiopian-section reviews-section">
                    <div className="section-heading">
                        <p>{dictionary.reviews}</p>
                        <h2>Latest voices from Addis Ababa, Dire Dawa, Hawassa, and beyond.</h2>
                    </div>
                    <div className="reviews-layout">
                        {activeReview ? (
                            <article className="review-spotlight">
                                <div className="review-topline">
                                    <strong>{activeReview.username}</strong>
                                    <span>{'★'.repeat(activeReview.rating)}</span>
                                </div>
                                <p>{activeReview.comment}</p>
                                <div className="review-footer">
                                    <span>{activeReview.location}</span>
                                    <span>{new Date(activeReview.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="carousel-nav">
                                    {homepageData.reviews.map((review, index) => (
                                        <button
                                            key={review.id}
                                            type="button"
                                            className={index === currentReview ? 'active' : ''}
                                            onClick={() => setCurrentReview(index)}
                                            aria-label={`Show review ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </article>
                        ) : null}

                        <form className="review-form-card" onSubmit={handleReviewSubmit}>
                            <h3>{dictionary.reviewCta}</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={reviewForm.username}
                                onChange={event => setReviewForm(previous => ({ ...previous, username: event.target.value }))}
                            />
                            <div className="review-form-row">
                                <select
                                    value={reviewForm.rating}
                                    onChange={event => setReviewForm(previous => ({ ...previous, rating: Number(event.target.value) }))}
                                >
                                    {[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} Stars</option>)}
                                </select>
                                <select
                                    value={reviewForm.language}
                                    onChange={event => setReviewForm(previous => ({ ...previous, language: event.target.value }))}
                                >
                                    <option value="en">English</option>
                                    <option value="am">Amharic</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Location"
                                value={reviewForm.location}
                                onChange={event => setReviewForm(previous => ({ ...previous, location: event.target.value }))}
                            />
                            <textarea
                                rows="4"
                                placeholder="Share your Buna Tetu moment..."
                                value={reviewForm.comment}
                                onChange={event => setReviewForm(previous => ({ ...previous, comment: event.target.value }))}
                            />
                            <button type="submit" className="primary-link">{dictionary.reviewCta}</button>
                        </form>
                    </div>
                </section>

                <section className="ethiopian-section">
                    <div className="section-heading">
                        <p>{dictionary.gallery}</p>
                        <h2>Textures from ceremony tables, roasting pans, and Addis coffee houses.</h2>
                    </div>
                    <div className="gallery-grid">
                        {homepageData.galleryFeed.map((item, index) => (
                            <article key={item.id} className="gallery-card">
                                <img
                                    src={getGalleryImage(item, index)}
                                    alt={item.title}
                                    loading="lazy"
                                    onError={event => handleImageError(event, defaultCoffeeImages[index % defaultCoffeeImages.length])}
                                />
                                <div className="gallery-overlay">
                                    <strong>{item.title}</strong>
                                    <span>☕ Ethiopian coffee culture</span>
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="hashtag-row">
                        {homepageData.hashtags.map(tag => <span key={tag}>{tag}</span>)}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">Follow on Instagram</a>
                    </div>
                </section>

                <section className="ethiopian-section subscription-section">
                    <div className="subscription-copy">
                        <p>{dictionary.subscribe}</p>
                        <h2>Fresh roast drops from Ethiopia, free shipping within Addis, and recipe cards for every box.</h2>
                        <div className="benefit-list">
                            <span>Fresh roast from Ethiopia</span>
                            <span>Free shipping within Addis</span>
                            <span>Exclusive single-origin drops</span>
                            <span>Traditional recipe card included</span>
                        </div>
                    </div>
                    <form className="subscription-form" onSubmit={handleSubscribe}>
                        <label>
                            Email or phone number
                            <input
                                type="text"
                                value={subscribeForm.contact}
                                onChange={event => setSubscribeForm(previous => ({ ...previous, contact: event.target.value }))}
                                placeholder="name@email.com or +2519..."
                            />
                        </label>
                        <label>
                            Location
                            <input
                                type="text"
                                value={subscribeForm.location}
                                onChange={event => setSubscribeForm(previous => ({ ...previous, location: event.target.value }))}
                                placeholder="Bole, Addis Ababa"
                            />
                        </label>
                        <button type="submit" className="primary-link">{dictionary.subscribeCta}</button>
                    </form>
                </section>

                {toast ? <div className="toast-banner">{toast}</div> : null}
            </div>
        </Layout>
    );
}
