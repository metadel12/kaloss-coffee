import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { verifyEmailOtp } from '../utils/api';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const [code, setCode] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(300);
    const [attempts, setAttempts] = useState(0);
    const [state, setState] = useState({ loading: false, message: '', error: '' });

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;
        const timer = setTimeout(() => setSecondsLeft(value => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const handleVerify = async event => {
        event.preventDefault();
        setState({ loading: true, message: '', error: '' });
        try {
            const { data } = await verifyEmailOtp({ identifier: user?.email, code });
            await refreshProfile();
            setState({ loading: false, message: data.message, error: '' });
            setTimeout(() => router.push('/login'), 1400);
        } catch (error) {
            setAttempts(value => value + 1);
            setState({ loading: false, message: '', error: error.response?.data?.message || 'Verification failed.' });
        }
    };

    const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

    return (
        <Layout title="Verify Your Email Address">
            <section className="single-auth-page">
                <div className="auth-card centered">
                    <div className="auth-card-header">
                        <div className="auth-badge">✉</div>
                        <h1>Verify Your Email Address</h1>
                        <p>We sent a 6-digit code to {user?.email || 'your email address'}.</p>
                    </div>
                    <form className="auth-form" onSubmit={handleVerify}>
                        <input
                            className="otp-large-input"
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={code}
                            onChange={event => setCode(event.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                        />
                        <p className="auth-timer">Code expires in {timerLabel}</p>
                        <button type="submit" className="auth-primary-button" disabled={state.loading || code.length !== 6}>
                            {state.loading ? 'Verifying...' : 'Verify email'}
                        </button>
                        <button type="button" className="secondary-action-button" disabled={attempts >= 3}>
                            {attempts >= 3 ? 'Resend limit reached' : 'Resend code'}
                        </button>
                        {state.message && <p className="form-success">{state.message}</p>}
                        {state.error && <p className="form-error">{state.error}</p>}
                    </form>
                </div>
            </section>
        </Layout>
    );
}
