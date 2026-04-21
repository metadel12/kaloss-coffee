import Link from 'next/link';
import Layout from '../components/Layout';

export default function ForbiddenPage() {
    return (
        <Layout title="Access Denied">
            <section className="single-auth-page">
                <div className="auth-card centered">
                    <div className="auth-card-header">
                        <div className="auth-badge">Locked</div>
                        <h1>Access Denied</h1>
                        <p>You do not have permission to access this page.</p>
                    </div>
                    <div className="auth-action-row">
                        <Link href="/" className="auth-primary-button">Back to Home</Link>
                        <Link href="/contact" className="secondary-action-button">Contact Support</Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
