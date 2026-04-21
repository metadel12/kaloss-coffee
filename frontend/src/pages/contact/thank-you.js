import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function ContactThankYouPage() {
    const router = useRouter();
    const reference = router.query.ref || 'KAL-REF-PENDING';

    return (
        <Layout title="Thank You">
            <section className="subpage-hero contact-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Thank you for reaching out</span>
                    <h1>Your message is on its way</h1>
                    <p>We have received your request and our team will usually reply within 24 to 48 hours depending on the topic.</p>
                </div>
            </section>
            <section className="contact-thankyou-card">
                <strong>Reference Number</strong>
                <h2>{reference}</h2>
                <p>An email confirmation would normally be sent to the address you provided, along with next-step guidance from the right Kaloss team.</p>
                <div className="about-hero-actions">
                    <Link href="/">Back to Home</Link>
                    <Link href="/products">Shop Our Coffees</Link>
                    <Link href="/about">Read Our Story</Link>
                </div>
            </section>
        </Layout>
    );
}
