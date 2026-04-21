import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="site-footer kaloss-footer">
            <div className="footer-brand">
                <strong>Kaloss Coffee</strong>
                <p>From Ethiopian Highlands to Your Cup</p>
                <span className="flag-line" />
            </div>

            <div className="footer-links">
                <Link href="/products">Our Coffees</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/contact/wholesale">Wholesale</Link>
                <Link href="/contact/careers">Careers</Link>
                <Link href="/products">Blog</Link>
            </div>

            <div className="footer-meta">
                <p>Open daily: 7:00 AM - 10:00 PM</p>
                <p>Bole, Addis Ababa | Export office available</p>
                <div className="footer-socials">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
                    <a href="https://telegram.org" target="_blank" rel="noreferrer">Telegram</a>
                </div>
            </div>
        </footer>
    );
}
