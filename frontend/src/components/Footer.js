import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
    fetchFooterLinks,
    fetchInstagramFeed,
    fetchSocialFollowerCounts,
    fetchWorkingHours,
    subscribeContactNewsletter,
} from '../utils/api';

const fallbackLinks = [
    { id: 'shop-1', category: 'shop', title: 'Yirgacheffe Grade 1', url: '/products?region=Yirgacheffe', description: 'Floral and tea-like lots', badge: 'Top rated' },
    { id: 'shop-2', category: 'shop', title: 'Sidama Natural', url: '/products?region=Sidama', description: 'Berry sweetness and cocoa' },
    { id: 'shop-3', category: 'shop', title: 'Guji Forest Coffee', url: '/products?region=Guji', description: 'Wild-grown fruit layers' },
    { id: 'shop-4', category: 'shop', title: 'Harrar Longberry', url: '/products?region=Harrar', description: 'Classic mocha profile' },
    { id: 'shop-5', category: 'shop', title: 'Limu Washed', url: '/products?region=Limu', description: 'Citrus and honey clarity' },
    { id: 'shop-6', category: 'shop', title: 'Gift Sets', url: '/gifts', description: 'Curated coffee gifting', badge: 'Giftable' },
    { id: 'support-1', category: 'support', title: 'FAQ', url: '/contact', description: 'Common answers and quick help' },
    { id: 'support-2', category: 'support', title: 'Shipping Information', url: '/contact', description: 'Delivery windows and regions' },
    { id: 'support-3', category: 'support', title: 'Returns and Refunds', url: '/contact', description: 'Support for damaged or wrong items' },
    { id: 'support-4', category: 'support', title: 'Track Order', url: '/orders', description: 'Review your order progress' },
    { id: 'support-5', category: 'support', title: 'Brewing Guide', url: '/about/process', description: 'Jebena, V60, and espresso tips' },
    { id: 'support-6', category: 'support', title: 'Privacy Policy', url: '/contact', description: 'How we use your information' },
];

const fallbackSocials = [
    { id: 'social-1', platform: 'Instagram', url: 'https://instagram.com/kalosscoffee', username: '@kalosscoffee', followerCount: 15200, icon: 'IG' },
    { id: 'social-2', platform: 'Facebook', url: 'https://facebook.com/kalosscoffee', username: 'Kaloss Coffee', followerCount: 8500, icon: 'FB' },
    { id: 'social-3', platform: 'X', url: 'https://x.com/kalosscoffee', username: '@kalosscoffee', followerCount: 3100, icon: 'X' },
    { id: 'social-4', platform: 'TikTok', url: 'https://tiktok.com/@kalosscoffee', username: '@kalosscoffee', followerCount: 5700, icon: 'TT' },
    { id: 'social-5', platform: 'LinkedIn', url: 'https://linkedin.com/company/kalosscoffee', username: 'Kaloss Coffee', followerCount: 1200, icon: 'IN' },
    { id: 'social-6', platform: 'YouTube', url: 'https://youtube.com/@kalosscoffee', username: '@kalosscoffee', followerCount: 2300, icon: 'YT' },
    { id: 'social-7', platform: 'Telegram', url: 'https://t.me/kalosscoffee', username: '@kalosscoffee', followerCount: 4200, icon: 'TG' },
];

const fallbackInstagramPosts = [
    { id: 'ig-1', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80', alt: 'Coffee cherries and burlap sacks', url: 'https://instagram.com/kalosscoffee/p/1', label: 'Farm harvest notes' },
    { id: 'ig-2', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80', alt: 'Barista pouring brewed coffee', url: 'https://instagram.com/kalosscoffee/p/2', label: 'Brew bar moments' },
    { id: 'ig-3', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', alt: 'Bagged coffee lineup on counter', url: 'https://instagram.com/kalosscoffee/p/3', label: 'Roastery release day' },
];

const fallbackHours = {
    label: 'Open now',
    customerSupportOpen: true,
    coffeeShopOpen: true,
    averageReplyHours: 2.4,
    liveChatAvailable: true,
    supportHours: {
        weekdays: 'Mon-Fri: 8:30AM - 6:00PM',
        saturday: 'Sat: 9:00AM - 4:00PM',
        sunday: 'Sun: Closed',
        coffeeShop: 'Coffee Shop: 7:00AM - 10:00PM',
    },
};

const staticShopHighlights = [
    { title: 'Light Roast', href: '/products?roast=Light', badge: 'Bright' },
    { title: 'Medium Roast', href: '/products?roast=Medium', badge: 'Balanced' },
    { title: 'Dark Roast', href: '/products?roast=Dark', badge: 'Bold' },
    { title: 'Subscription', href: '/products', badge: 'Weekly' },
];

const trustBadges = ['Grade 1 Specialty Coffee', 'Direct Trade', 'Fresh Roasted', 'Free Shipping 500+ ETB'];
const paymentMethods = ['Telebirr', 'CBEBirr', 'Visa', 'Mastercard'];

function formatFollowers(count) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(count >= 10000 ? 1 : 1)}K`;
    }

    return String(count);
}

function FooterAccordionSection({ id, title, isOpen, onToggle, children }) {
    return (
        <section className={`footer-accordion-section ${isOpen ? 'open' : ''}`}>
            <button type="button" className="footer-accordion-trigger" onClick={() => onToggle(id)} aria-expanded={isOpen}>
                <span>{title}</span>
                <span className="footer-accordion-icon">{isOpen ? '-' : '+'}</span>
            </button>
            <div className="footer-accordion-panel">
                {children}
            </div>
        </section>
    );
}

export default function Footer() {
    const [footerLinks, setFooterLinks] = useState(fallbackLinks);
    const [socials, setSocials] = useState(fallbackSocials);
    const [instagramPosts, setInstagramPosts] = useState(fallbackInstagramPosts);
    const [hours, setHours] = useState(fallbackHours);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [consentChecked, setConsentChecked] = useState(true);
    const [newsletterState, setNewsletterState] = useState({ status: 'idle', message: '' });
    const [copiedField, setCopiedField] = useState('');
    const [openSection, setOpenSection] = useState('shop');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [footerLanguage, setFooterLanguage] = useState('EN');
    const [footerCurrency, setFooterCurrency] = useState('ETB');

    useEffect(() => {
        let active = true;

        const loadFooterData = async () => {
            try {
                const [linksResponse, socialsResponse, instagramResponse, hoursResponse] = await Promise.all([
                    fetchFooterLinks(),
                    fetchSocialFollowerCounts(),
                    fetchInstagramFeed(),
                    fetchWorkingHours(),
                ]);

                if (!active) {
                    return;
                }

                if (Array.isArray(linksResponse.data) && linksResponse.data.length) {
                    setFooterLinks(linksResponse.data);
                }

                if (Array.isArray(socialsResponse.data) && socialsResponse.data.length) {
                    setSocials(socialsResponse.data);
                }

                if (Array.isArray(instagramResponse.data) && instagramResponse.data.length) {
                    setInstagramPosts(instagramResponse.data);
                }

                if (hoursResponse.data) {
                    setHours(previous => ({ ...previous, ...hoursResponse.data }));
                }
            } catch (error) {
                if (active) {
                    setFooterLinks(fallbackLinks);
                    setSocials(fallbackSocials);
                    setInstagramPosts(fallbackInstagramPosts);
                    setHours(fallbackHours);
                }
            }
        };

        loadFooterData();

        const handleScroll = () => setShowBackToTop(window.scrollY > 300);
        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => {
            active = false;
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!copiedField) {
            return undefined;
        }

        const timer = window.setTimeout(() => setCopiedField(''), 2000);
        return () => window.clearTimeout(timer);
    }, [copiedField]);

    const groupedLinks = useMemo(() => footerLinks.reduce((accumulator, link) => {
        if (!accumulator[link.category]) {
            accumulator[link.category] = [];
        }
        accumulator[link.category].push(link);
        return accumulator;
    }, {}), [footerLinks]);

    const handleCopy = async (value, key) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                setCopiedField(key);
            }
        } catch (error) {
            setCopiedField('');
        }
    };

    const handleNewsletterSubmit = async event => {
        event.preventDefault();

        const normalizedEmail = newsletterEmail.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
            setNewsletterState({ status: 'error', message: 'Enter a valid email address.' });
            return;
        }

        if (!consentChecked) {
            setNewsletterState({ status: 'error', message: 'Please accept the privacy notice first.' });
            return;
        }

        setNewsletterState({ status: 'loading', message: 'Subscribing...' });

        try {
            await subscribeContactNewsletter({
                email: normalizedEmail,
                source: 'footer',
                location: 'Footer Signup',
            });
            setNewsletterEmail('');
            setNewsletterState({ status: 'success', message: 'You are subscribed. Check your inbox for brew notes.' });
        } catch (error) {
            setNewsletterState({ status: 'error', message: 'We could not subscribe you right now. Please try again.' });
        }
    };

    const accordionSections = [
        {
            id: 'shop',
            title: 'Shop',
            content: (
                <div className="footer-link-list">
                    {(groupedLinks.shop || fallbackLinks.filter(link => link.category === 'shop')).map(link => (
                        <Link key={link.id} href={link.url} className="footer-link-card">
                            <span>{link.title}</span>
                            <small>{link.description}</small>
                        </Link>
                    ))}
                </div>
            ),
        },
        {
            id: 'support',
            title: 'Support',
            content: (
                <div className="footer-link-list">
                    {(groupedLinks.support || fallbackLinks.filter(link => link.category === 'support')).map(link => (
                        <Link key={link.id} href={link.url} className="footer-link-card">
                            <span>{link.title}</span>
                            <small>{link.description}</small>
                        </Link>
                    ))}
                </div>
            ),
        },
        {
            id: 'contact',
            title: 'Contact',
            content: (
                <div className="footer-contact-stack compact">
                    <p>Bole Sub-city, Woreda 03, Addis Ababa</p>
                    <button type="button" className="footer-copy-button" onClick={() => handleCopy('+251-11-123-4567', 'phone')}>
                        +251923956310{copiedField === 'phone' ? '(Copied)' : ''}
                    </button>
                    <button type="button" className="footer-copy-button" onClick={() => handleCopy('hello@kalosscoffee.com', 'email')}>
                        hello@kalosscoffee.com {copiedField === 'email' ? '(Copied)' : ''}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <footer className="site-footer kaloss-footer">
                <div className="kaloss-footer-shell">
                    <div className="footer-top-grid">
                        <section className="footer-panel footer-brand-panel">
                            <div className="footer-brand-lockup">
                                <div className="footer-logo-mark" aria-hidden="true">KC</div>
                                <div>
                                    <strong>Kaloss Coffee</strong>
                                    <p className="footer-kicker">Ethiopian Heritage</p>
                                </div>
                            </div>
                            <p className="footer-brand-story">From Ethiopian Highlands to Your Cup since 2010.</p>
                            <div className="footer-badge-list">
                                {trustBadges.map(badge => (
                                    <span key={badge} className="footer-trust-badge">{badge}</span>
                                ))}
                            </div>
                            <div className="footer-rating-row">
                                <span className="footer-stars">4.9/5</span>
                                <small>15,000+ happy customers</small>
                            </div>
                        </section>

                        <section className="footer-panel footer-desktop-section">
                            <div className="footer-section-heading">
                                <h3>Shop</h3>
                                <p>Regions and curated drops.</p>
                            </div>
                            <div className="footer-link-list">
                                {(groupedLinks.shop || fallbackLinks.filter(link => link.category === 'shop')).slice(0, 5).map(link => (
                                    <Link key={link.id} href={link.url} className="footer-link-card">
                                        <div className="footer-link-card-row">
                                            <span>{link.title}</span>
                                            {link.badge ? <strong>{link.badge}</strong> : null}
                                        </div>
                                        <small>{link.description}</small>
                                    </Link>
                                ))}
                            </div>
                            <div className="footer-chip-row">
                                {staticShopHighlights.slice(0, 3).map(item => (
                                    <Link key={item.title} href={item.href} className="footer-chip">
                                        <span>{item.title}</span>
                                        <small>{item.badge}</small>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="footer-panel footer-desktop-section">
                            <div className="footer-section-heading">
                                <h3>Support</h3>
                                <p>Help and policy links.</p>
                            </div>
                            <div className="footer-link-list">
                                {(groupedLinks.support || fallbackLinks.filter(link => link.category === 'support')).slice(0, 5).map(link => (
                                    <Link key={link.id} href={link.url} className="footer-link-card">
                                        <span>{link.title}</span>
                                        <small>{link.description}</small>
                                    </Link>
                                ))}
                            </div>
                            <div className="footer-support-note">
                                <strong>Average reply</strong>
                                <span>{hours.averageReplyHours} hours</span>
                            </div>
                        </section>

                        <section className="footer-panel footer-desktop-section">
                            <div className="footer-section-heading">
                                <h3>Contact</h3>
                                <p>Visit, call, or message us.</p>
                            </div>
                            <div className="footer-contact-stack">
                                <div>
                                    <strong>Visit us</strong>
                                    <p>Bole Sub-city, Woreda 03, Addis Ababa, Ethiopia</p>
                                </div>
                                <div>
                                    <strong>Call us</strong>
                                    <button type="button" className="footer-copy-button" onClick={() => handleCopy('+251-11-123-4567', 'phone')}>
                                        +251-23-956-310 {copiedField === 'phone' ? '(Copied)' : ''}
                                    </button>
                                </div>
                                <div>
                                    <strong>Email us</strong>
                                    <button type="button" className="footer-copy-button" onClick={() => handleCopy('hello@kalosscoffee.com', 'email')}>
                                        hello@kalosscoffee.com {copiedField === 'email' ? '(Copied)' : ''}
                                    </button>
                                </div>
                                <div className="footer-hours-card">
                                    <div className={`footer-hours-status ${hours.customerSupportOpen ? 'open' : 'closed'}`}>
                                        <span className="footer-status-dot" />
                                        {hours.label}
                                    </div>
                                    <p>{hours.supportHours?.weekdays}</p>
                                    <p>{hours.supportHours?.saturday}</p>
                                </div>
                            </div>
                        </section>

                        <section className="footer-panel footer-social-panel">
                            <div className="footer-section-heading">
                                <h3>Social + Newsletter</h3>
                                <p>Follow us and get brew notes.</p>
                            </div>
                            <div className="footer-social-grid">
                                {socials.slice(0, 4).map(item => (
                                    <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="footer-social-link">
                                        <span className="footer-social-icon">{item.icon || item.platform.slice(0, 2)}</span>
                                        <span>
                                            <strong>{item.platform}</strong>
                                            <small>{formatFollowers(item.followerCount)}</small>
                                        </span>
                                    </a>
                                ))}
                            </div>
                            <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                                <label htmlFor="footer-newsletter-email">Newsletter</label>
                                <div className="footer-newsletter-row">
                                    <input
                                        id="footer-newsletter-email"
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={event => setNewsletterEmail(event.target.value)}
                                        placeholder="Your email address"
                                    />
                                    <button type="submit" disabled={newsletterState.status === 'loading'}>
                                        {newsletterState.status === 'loading' ? '...' : 'Subscribe'}
                                    </button>
                                </div>
                                <label className="footer-consent-row">
                                    <input type="checkbox" checked={consentChecked} onChange={event => setConsentChecked(event.target.checked)} />
                                    <span>I agree to Kaloss updates.</span>
                                </label>
                                <p className={`footer-newsletter-status ${newsletterState.status}`}>
                                    {newsletterState.message || 'Coffee tips and offers.'}
                                </p>
                            </form>
                        </section>
                    </div>

                    <div className="footer-mobile-accordion">
                        {accordionSections.map(section => (
                            <FooterAccordionSection
                                key={section.id}
                                id={section.id}
                                title={section.title}
                                isOpen={openSection === section.id}
                                onToggle={id => setOpenSection(current => (current === id ? '' : id))}
                            >
                                {section.content}
                            </FooterAccordionSection>
                        ))}
                    </div>

                    <div className="footer-bottom-bar">
                        <div className="footer-bottom-copy">
                            <p>&copy; {new Date().getFullYear()} Kaloss Coffee Trading PLC. All rights reserved.</p>
                            <p>We ship worldwide and roast proudly in Ethiopia.</p>
                        </div>
                        <div className="footer-payment-row">
                            {paymentMethods.map(method => (
                                <span key={method} className="footer-payment-pill">{method}</span>
                            ))}
                        </div>
                        <div className="footer-controls-row">
                            <div className="footer-selector-group" aria-label="Language selector">
                                <button type="button" className={footerLanguage === 'EN' ? 'active' : ''} onClick={() => setFooterLanguage('EN')}>EN</button>
                                <button type="button" className={footerLanguage === 'AM' ? 'active' : ''} onClick={() => setFooterLanguage('AM')}>AM</button>
                            </div>
                            <div className="footer-selector-group" aria-label="Currency selector">
                                <button type="button" className={footerCurrency === 'ETB' ? 'active' : ''} onClick={() => setFooterCurrency('ETB')}>ETB</button>
                                <button type="button" className={footerCurrency === 'USD' ? 'active' : ''} onClick={() => setFooterCurrency('USD')}>USD</button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <button
                type="button"
                className={`back-to-top-button ${showBackToTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
            >
                Top
            </button>
        </>
    );
}
