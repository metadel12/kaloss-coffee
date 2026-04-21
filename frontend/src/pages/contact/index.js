import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import {
    fetchChatMessages,
    fetchFaqs,
    markFaqHelpful,
    sendChatMessage,
    submitContactInquiry,
} from '../../utils/api';

const subjects = ['General Inquiry', 'Wholesale/Bulk Order', 'Partnership/Collaboration', 'Press/Media', 'Customer Support', 'Feedback/Suggestions', 'Coffee Subscription', 'Farm Visit Request'];
const contactMethods = ['Email', 'Phone', 'Telegram'];
const timeOptions = ['Morning (9AM - 12PM)', 'Afternoon (2PM - 5PM)', 'Evening (7PM - 9PM)', 'Any time'];
const faqCategories = ['All', 'Orders', 'Products', 'Wholesale', 'Ceremony'];

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    orderNumber: '',
    message: '',
    preferredContact: 'Email',
    bestTimeToContact: 'Any time',
    newsletterSignup: false,
};

const locations = [
    { name: 'Headquarters', address: 'Bole Sub-city, Woreda 03, Addis Ababa', detail: 'Near Edna Mall, behind Alem Building' },
    { name: 'Roastery', address: 'Akaki Kality, Addis Ababa', detail: 'Production roasting and packaging hub' },
    { name: 'Coffee Shop', address: 'Piassa, Addis Ababa', detail: 'Daily ceremony, tasting flights, and retail bar' },
    { name: 'Export Office', address: 'Mexico Square, Addis Ababa', detail: 'Export coordination and trade meetings' },
];

export default function ContactPage() {
    const router = useRouter();
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });
    const [faqCategory, setFaqCategory] = useState('All');
    const [faqSearch, setFaqSearch] = useState('');
    const [faqs, setFaqs] = useState([]);
    const [faqLoading, setFaqLoading] = useState(true);
    const [chatSession, setChatSession] = useState('demo');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const saved = window.localStorage.getItem('kaloss-contact-draft');
        const storedSession = window.localStorage.getItem('kaloss-chat-session');

        if (saved) {
            setForm(current => ({ ...current, ...JSON.parse(saved) }));
        }

        if (storedSession) {
            setChatSession(storedSession);
        } else {
            const nextSession = `session-${Date.now()}`;
            window.localStorage.setItem('kaloss-chat-session', nextSession);
            setChatSession(nextSession);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('kaloss-contact-draft', JSON.stringify(form));
        }
    }, [form]);

    useEffect(() => {
        let mounted = true;
        setFaqLoading(true);
        fetchFaqs({ category: faqCategory, q: faqSearch })
            .then(response => {
                if (mounted) {
                    setFaqs(response.data || []);
                }
            })
            .catch(() => {
                if (mounted) {
                    setFaqs([]);
                }
            })
            .finally(() => {
                if (mounted) {
                    setFaqLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [faqCategory, faqSearch]);

    useEffect(() => {
        if (!chatSession) {
            return;
        }

        fetchChatMessages(chatSession)
            .then(response => setChatMessages(response.data || []))
            .catch(() => setChatMessages([]));
    }, [chatSession]);

    const messageCount = useMemo(() => form.message.length, [form.message]);

    const handleChange = event => {
        const { name, value, type, checked } = event.target;
        setForm(current => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (form.message.trim().length < 20) {
            setStatus({ loading: false, error: 'Please write at least 20 characters in your message.', success: '' });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await submitContactInquiry(form);
            window.localStorage.removeItem('kaloss-contact-draft');
            setForm(initialForm);
            router.push(`/contact/thank-you?ref=${response.data.inquiryId}`);
        } catch (error) {
            setStatus({ loading: false, error: 'We could not send your message right now. Please try again.', success: '' });
        }
    };

    const handleFaqVote = async (id, helpful) => {
        const response = await markFaqHelpful(id, { helpful });
        setFaqs(current => current.map(item => (item.id === id ? response.data : item)));
    };

    const handleChatSubmit = async event => {
        event.preventDefault();
        if (!chatInput.trim()) {
            return;
        }

        const response = await sendChatMessage({ sessionId: chatSession, message: chatInput });
        setChatMessages(response.data.messages || []);
        setChatInput('');
    };

    return (
        <Layout title="Contact Kaloss Coffee">
            <section className="subpage-hero contact-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">We would love to hear from you</span>
                    <h1>Contact Kaloss Coffee</h1>
                    <p>Questions, partnerships, wholesale plans, support requests, or ceremony bookings all start here.</p>
                </div>
            </section>

            <section className="contact-split">
                <form className="contact-form-card" onSubmit={handleSubmit}>
                    <div className="section-heading">
                        <span className="section-kicker">Contact Form</span>
                        <h2>Send your message to the Kaloss team</h2>
                    </div>
                    <div className="contact-form-grid">
                        <label>
                            <span>Full Name</span>
                            <input name="fullName" value={form.fullName} onChange={handleChange} required />
                        </label>
                        <label>
                            <span>Email Address</span>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </label>
                        <label>
                            <span>Phone Number</span>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9X XXX XXXX" />
                        </label>
                        <label>
                            <span>Subject</span>
                            <select name="subject" value={form.subject} onChange={handleChange}>
                                {subjects.map(item => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                        {form.subject === 'Customer Support' ? (
                            <label className="contact-form-full">
                                <span>Order Number</span>
                                <input name="orderNumber" value={form.orderNumber} onChange={handleChange} />
                            </label>
                        ) : null}
                        <label className="contact-form-full">
                            <span>Message</span>
                            <textarea name="message" rows="6" value={form.message} onChange={handleChange} minLength="20" maxLength="2000" required />
                            <small>{messageCount}/2000 characters</small>
                        </label>
                    </div>
                    <div className="contact-option-row">
                        <div>
                            <span>Preferred Contact Method</span>
                            <div className="chip-row">
                                {contactMethods.map(item => (
                                    <label key={item} className={`choice-chip ${form.preferredContact === item ? 'active' : ''}`}>
                                        <input type="radio" name="preferredContact" value={item} checked={form.preferredContact === item} onChange={handleChange} />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <label>
                            <span>Best Time To Contact</span>
                            <select name="bestTimeToContact" value={form.bestTimeToContact} onChange={handleChange}>
                                {timeOptions.map(item => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                    </div>
                    <label className="checkbox-line">
                        <input type="checkbox" name="newsletterSignup" checked={form.newsletterSignup} onChange={handleChange} />
                        <span>Subscribe to coffee stories and offers</span>
                    </label>
                    {status.error ? <p className="form-error">{status.error}</p> : null}
                    <button type="submit" className="contact-submit-button" disabled={status.loading}>
                        {status.loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <aside className="contact-info-column">
                    <article className="contact-info-card">
                        <span className="section-kicker">Addis Ababa Headquarters</span>
                        <h3>Bole Sub-city, Woreda 03</h3>
                        <p>Near Edna Mall, behind Alem Building.</p>
                        <a href="https://maps.google.com/?q=Bole%20Addis%20Ababa" target="_blank" rel="noreferrer">Open in Google Maps</a>
                    </article>
                    <article className="contact-info-card">
                        <h3>Phone And Messaging</h3>
                        <p>Main: +251-11-123-4567</p>
                        <p>Mobile/WhatsApp: +251-91-234-5678</p>
                        <p>Telegram: @KalossCoffeeSupport</p>
                        <p>Viber: +251-91-234-5678</p>
                    </article>
                    <article className="contact-info-card">
                        <h3>Email Addresses</h3>
                        <p>hello@kalosscoffee.com</p>
                        <p>wholesale@kalosscoffee.com</p>
                        <p>partners@kalosscoffee.com</p>
                        <p>press@kalosscoffee.com</p>
                    </article>
                    <article className="contact-info-card">
                        <h3>Working Hours</h3>
                        <p>Monday - Friday: 8:30 AM - 6:00 PM EAT</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Coffee Shop: 7:00 AM - 10:00 PM daily</p>
                    </article>
                </aside>
            </section>

            <section className="contact-map-section">
                <div className="section-heading">
                    <span className="section-kicker">Locations</span>
                    <h2>Find Kaloss across Addis Ababa</h2>
                </div>
                <div className="contact-location-grid">
                    {locations.map(location => (
                        <article key={location.name} className="contact-location-card">
                            <h3>{location.name}</h3>
                            <p>{location.address}</p>
                            <span>{location.detail}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="contact-support-grid">
                <div className="contact-faq-panel">
                    <div className="section-heading">
                        <span className="section-kicker">Customer Support</span>
                        <h2>FAQ and quick answers</h2>
                    </div>
                    <div className="contact-faq-controls">
                        <input value={faqSearch} onChange={event => setFaqSearch(event.target.value)} placeholder="Search FAQs" />
                        <select value={faqCategory} onChange={event => setFaqCategory(event.target.value)}>
                            {faqCategories.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className="contact-faq-list">
                        {faqLoading ? <div className="about-skeleton" /> : faqs.map(item => (
                            <article key={item.id} className="contact-faq-item">
                                <h3>{item.question}</h3>
                                <p>{item.answer}</p>
                                <div className="faq-vote-row">
                                    <button type="button" onClick={() => handleFaqVote(item.id, true)}>Helpful ({item.helpfulCount})</button>
                                    <button type="button" onClick={() => handleFaqVote(item.id, false)}>Not helpful ({item.notHelpfulCount})</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className="contact-chat-panel">
                    <div className="section-heading">
                        <span className="section-kicker">Live Chat</span>
                        <h2>Quick support for common questions</h2>
                    </div>
                    <div className="chat-thread">
                        {chatMessages.map(message => (
                            <div key={message.id} className={`chat-bubble ${message.sender}`}>
                                <strong>{message.sender === 'bot' ? 'Kaloss' : 'You'}</strong>
                                <p>{message.message}</p>
                            </div>
                        ))}
                    </div>
                    <form className="chat-form" onSubmit={handleChatSubmit}>
                        <input value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="Ask about shipping, coffee, or wholesale" />
                        <button type="submit">Send</button>
                    </form>
                </aside>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">Special Requests</span>
                    <h2>Need a quote, a farm tour, or a careers conversation?</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/contact/wholesale">Wholesale Inquiry</Link>
                    <Link href="/contact/farm-visit">Farm Visit</Link>
                    <Link href="/contact/careers">Careers</Link>
                </div>
            </section>
        </Layout>
    );
}
