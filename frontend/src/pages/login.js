import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
    login as loginApi,
    setToken,
    requestLoginOtp,
    verifyLoginOtp,
    forgotPassword,
} from '../utils/api';
import { getPasswordStrength, validateIdentifier } from '../utils/auth';

const initialOtpState = { step: 'idle', identifier: '', code: '', message: '', error: '', loading: false };

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [mfaState, setMfaState] = useState(null);
    const [otpState, setOtpState] = useState(initialOtpState);
    const [forgotState, setForgotState] = useState({ open: false, identifier: '', loading: false, message: '', error: '' });

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
    const identifierValid = validateIdentifier(identifier);

    const finishLogin = data => {
        login({ user: data.user, token: data.token });
        setToken(data.token);
        const callbackUrl = typeof router.query.callbackUrl === 'string' ? router.query.callbackUrl : '';
        router.push(callbackUrl || (['admin', 'super_admin'].includes(data.user?.role) ? '/admin/dashboard' : '/profile'));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await loginApi({ identifier, password, rememberMe });
            if (data.requiresTwoFactor) {
                setMfaState(data);
                return;
            }
            finishLogin(data);
        } catch (err) {
            const response = err.response?.data;
            setFailedAttempts(response?.failedAttempts || 0);
            setError(response?.message || 'Unable to sign in.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpRequest = async () => {
        setOtpState(previous => ({ ...previous, loading: true, error: '', message: '' }));
        try {
            const { data } = await requestLoginOtp({ identifier: otpState.identifier });
            setOtpState(previous => ({
                ...previous,
                step: 'verify',
                loading: false,
                message: data.message,
            }));
        } catch (err) {
            setOtpState(previous => ({
                ...previous,
                loading: false,
                error: err.response?.data?.message || 'Unable to send OTP.',
            }));
        }
    };

    const handleOtpVerify = async () => {
        setOtpState(previous => ({ ...previous, loading: true, error: '' }));
        try {
            const { data } = await verifyLoginOtp({
                identifier: otpState.identifier,
                code: otpState.code,
                rememberMe,
            });
            finishLogin(data);
        } catch (err) {
            setOtpState(previous => ({
                ...previous,
                loading: false,
                error: err.response?.data?.message || 'OTP verification failed.',
            }));
        }
    };

    const handleForgotPassword = async event => {
        event.preventDefault();
        setForgotState(previous => ({ ...previous, loading: true, error: '', message: '' }));
        try {
            const { data } = await forgotPassword({ identifier: forgotState.identifier });
            setForgotState(previous => ({
                ...previous,
                loading: false,
                message: `${data.message} Demo token: ${data.resetToken}`,
            }));
        } catch (err) {
            setForgotState(previous => ({
                ...previous,
                loading: false,
                error: err.response?.data?.message || 'Could not start reset flow.',
            }));
        }
    };

    return (
        <Layout title="Welcome Back to Kaloss Coffee">
            <section className="auth-shell auth-shell-login">
                <div className="auth-hero-panel">
                    <p className="auth-eyebrow">Ethiopian Ceremony Ritual</p>
                    <h1>Welcome Back to Kaloss Coffee</h1>
                    <p>Sign in to continue your coffee journey, track new orders, manage loyalty rewards, and pick up right where you left off.</p>
                    <div className="steam-cup">
                        <span className="steam-thread steam-thread-one" />
                        <span className="steam-thread steam-thread-two" />
                        <span className="steam-thread steam-thread-three" />
                        <div className="coffee-cup-art" aria-hidden="true">
                            <div className="cup-handle" />
                        </div>
                    </div>
                    <div className="auth-side-notes">
                        <span>Remember me for 30 days</span>
                        <span>Passwordless OTP</span>
                        <span>Google, Facebook, Telegram, Apple ready</span>
                        <span>Biometric-ready experience for supported devices</span>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-badge">☕</div>
                        <h2>Welcome Back!</h2>
                        <p>Use your email or Ethiopian mobile number to access your Kaloss account.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label className="floating-field">
                            <span>Email or Phone Number</span>
                            <input
                                type="text"
                                value={identifier}
                                onChange={event => setIdentifier(event.target.value)}
                                placeholder="john@example.com or 0912345678"
                                autoComplete="username"
                                required
                            />
                            <small>{identifier ? (identifierValid ? 'Ready to use' : 'Use an email or Ethiopian phone number') : 'Email or +251 / 09 phone accepted'}</small>
                        </label>

                        <label className="floating-field">
                            <span>Password</span>
                            <div className="password-field-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                                <button type="button" className="ghost-icon-button" onClick={() => setShowPassword(value => !value)}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <small>Password strength: {passwordStrength.label}</small>
                        </label>

                        <div className="auth-inline-row">
                            <label className="checkbox-row">
                                <input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} />
                                <span>Remember me</span>
                            </label>
                            <button type="button" className="text-link-button" onClick={() => setForgotState(previous => ({ ...previous, open: !previous.open }))}>
                                Forgot Password?
                            </button>
                        </div>

                        {failedAttempts >= 3 && (
                            <div className="auth-alert warning">
                                CAPTCHA would appear here after 3 failed attempts. Current failed attempts: {failedAttempts}.
                            </div>
                        )}

                        {error && <p className="form-error">{error}</p>}

                        <button className="auth-primary-button" type="submit" disabled={loading || !identifierValid}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-divider">or continue with</div>

                    <div className="social-grid">
                        <button type="button" className="social-button google">G Google</button>
                        <button type="button" className="social-button facebook">f Facebook</button>
                        <button type="button" className="social-button telegram">Telegram</button>
                        <button type="button" className="social-button apple">Apple</button>
                    </div>

                    <div className="mini-card">
                        <div className="mini-card-header">
                            <h3>Login with OTP</h3>
                            <p>No password needed. We will send a 6-digit login code.</p>
                        </div>
                        <div className="otp-inline-grid">
                            <input
                                type="text"
                                placeholder="Email or phone"
                                value={otpState.identifier}
                                onChange={event => setOtpState(previous => ({ ...previous, identifier: event.target.value }))}
                            />
                            <button type="button" className="secondary-action-button" onClick={handleOtpRequest} disabled={otpState.loading || !validateIdentifier(otpState.identifier)}>
                                {otpState.loading && otpState.step === 'idle' ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                        {otpState.step === 'verify' && (
                            <div className="otp-verify-panel">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="6-digit OTP"
                                    value={otpState.code}
                                    onChange={event => setOtpState(previous => ({ ...previous, code: event.target.value }))}
                                />
                                <button type="button" className="auth-primary-button" onClick={handleOtpVerify} disabled={otpState.loading || otpState.code.length !== 6}>
                                    {otpState.loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        )}
                        {otpState.message && <p className="form-success">{otpState.message}</p>}
                        {otpState.error && <p className="form-error">{otpState.error}</p>}
                    </div>

                    {forgotState.open && (
                        <form className="mini-card" onSubmit={handleForgotPassword}>
                            <div className="mini-card-header">
                                <h3>Forgot password</h3>
                                <p>Enter your email or phone number to receive a reset link and OTP.</p>
                            </div>
                            <input
                                type="text"
                                value={forgotState.identifier}
                                onChange={event => setForgotState(previous => ({ ...previous, identifier: event.target.value }))}
                                placeholder="john@example.com or +251912345678"
                                required
                            />
                            <button className="secondary-action-button" type="submit" disabled={forgotState.loading}>
                                {forgotState.loading ? 'Sending...' : 'Send reset instructions'}
                            </button>
                            {forgotState.message && <p className="form-success">{forgotState.message}</p>}
                            {forgotState.error && <p className="form-error">{forgotState.error}</p>}
                        </form>
                    )}

                    {mfaState && (
                        <div className="mini-card mfa-card">
                            <div className="mini-card-header">
                                <h3>Multi-Factor Authentication</h3>
                                <p>Your password is correct. Use a second step to finish signing in.</p>
                            </div>
                            <ul className="feature-list">
                                {mfaState.mfaOptions.map(option => (
                                    <li key={option}>{option}</li>
                                ))}
                            </ul>
                            <label className="checkbox-row">
                                <input type="checkbox" defaultChecked />
                                <span>Trust this device for 30 days</span>
                            </label>
                            <p className="auth-alert">Demo mode: enabling 2FA on the profile security tab uses the first 6 characters of the generated secret as the verification code.</p>
                        </div>
                    )}

                    <p className="auth-footer-copy">
                        Don&apos;t have an account? <Link href="/register">Create Account →</Link>
                    </p>
                </div>
            </section>
        </Layout>
    );
}
