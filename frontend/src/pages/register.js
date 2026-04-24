import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { register as registerApi, setToken } from '../utils/api';
import { getPasswordChecks, getPasswordStrength, isEmail, isEthiopianPhone, normalizePhone } from '../utils/auth';

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredRoast: 'Medium',
    newsletterTopics: {
        weeklyTips: true,
        newProducts: true,
        tutorials: false,
    },
    language: 'English',
    timezone: 'EAT',
    referredByCode: '',
    agreeTerms: true,
    isAdult: true,
};

export default function Register() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successOffer, setSuccessOffer] = useState(null);

    const passwordChecks = useMemo(() => getPasswordChecks(form.password), [form.password]);
    const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

    const updateField = (field, value) => setForm(previous => ({ ...previous, [field]: value }));

    const nextStep = () => {
        if (step === 1) {
            if (!form.fullName || !isEmail(form.email) || !isEthiopianPhone(form.phone)) {
                setError('Please complete your name, email, and Ethiopian phone number.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (!Object.values(passwordChecks).every(Boolean)) {
                setError('Password must satisfy all security requirements.');
                return;
            }
        }

        if (step === 2 && !form.agreeTerms) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setError('');
        setStep(current => Math.min(3, current + 1));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await registerApi({
                ...form,
                phone: normalizePhone(form.phone),
                newsletterSubscribed: Object.values(form.newsletterTopics).some(Boolean),
            });
            login({ user: data.user, token: data.token });
            setToken(data.token);
            setSuccessOffer(data.welcomeOffer);
            const callbackUrl = typeof router.query.callbackUrl === 'string' ? router.query.callbackUrl : '';
            router.push(callbackUrl || '/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Create Your Kaloss Coffee Account">
            <section className="auth-shell auth-shell-register">
                <div className="auth-hero-panel register-panel">
                    <p className="auth-eyebrow">Join the Kaloss Coffee Family</p>
                    <h1>Create Your Account</h1>
                    <p>Set your roast preferences, verify your Ethiopian contact details, and unlock your first-order welcome offer in one streamlined flow.</p>
                    <div className="register-progress-visual">
                        {[1, 2, 3].map(item => (
                            <div key={item} className={`progress-node ${item <= step ? 'active' : ''}`}>
                                <strong>{item}</strong>
                                <span>{item === 1 ? 'Personal' : item === 2 ? 'Preferences' : 'Verification'}</span>
                            </div>
                        ))}
                    </div>
                    {successOffer && (
                        <div className="auth-alert success">
                            Welcome offer unlocked: {successOffer.code} for {successOffer.discount}.
                        </div>
                    )}
                </div>

                <form className="auth-card register-card" onSubmit={handleSubmit}>
                    <div className="auth-card-header">
                        <div className="auth-badge">☕</div>
                        <h2>Step {step} of 3</h2>
                        <p>{step === 1 ? 'Personal Information' : step === 2 ? 'Preferences' : 'Verification'}</p>
                    </div>

                    {step === 1 && (
                        <div className="auth-form">
                            <label className="floating-field">
                                <span>Full Name</span>
                                <input value={form.fullName} onChange={event => updateField('fullName', event.target.value)} placeholder="Abebe Bekele" required />
                            </label>
                            <label className="floating-field">
                                <span>Email Address</span>
                                <input type="email" value={form.email} onChange={event => updateField('email', event.target.value)} placeholder="abebe@example.com" required />
                            </label>
                            <label className="floating-field">
                                <span>Phone Number</span>
                                <input value={form.phone} onChange={event => updateField('phone', event.target.value)} placeholder="+251 91 234 5678" required />
                            </label>
                            <label className="floating-field">
                                <span>Password</span>
                                <div className="password-field-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={event => updateField('password', event.target.value)}
                                        placeholder="Create a secure password"
                                        required
                                    />
                                    <button type="button" className="ghost-icon-button" onClick={() => setShowPassword(value => !value)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <small>Strength: {passwordStrength.label}</small>
                            </label>
                            <label className="floating-field">
                                <span>Confirm Password</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={event => updateField('confirmPassword', event.target.value)}
                                    placeholder="Repeat your password"
                                    required
                                />
                            </label>

                            <div className="mini-card">
                                <h3>Password requirements</h3>
                                <ul className="feature-list compact">
                                    <li className={passwordChecks.length ? 'ok' : ''}>At least 8 characters</li>
                                    <li className={passwordChecks.uppercase ? 'ok' : ''}>At least 1 uppercase letter</li>
                                    <li className={passwordChecks.lowercase ? 'ok' : ''}>At least 1 lowercase letter</li>
                                    <li className={passwordChecks.number ? 'ok' : ''}>At least 1 number</li>
                                    <li className={passwordChecks.special ? 'ok' : ''}>At least 1 special character</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="auth-form">
                            <div className="mini-card">
                                <h3>Preferred Roast Level</h3>
                                <div className="option-pills">
                                    {['Light', 'Medium', 'Dark'].map(roast => (
                                        <button
                                            key={roast}
                                            type="button"
                                            className={`pill-button ${form.preferredRoast === roast ? 'active' : ''}`}
                                            onClick={() => updateField('preferredRoast', roast)}
                                        >
                                            {roast}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mini-card">
                                <h3>Newsletter preferences</h3>
                                <label className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        checked={form.newsletterTopics.weeklyTips}
                                        onChange={event => updateField('newsletterTopics', { ...form.newsletterTopics, weeklyTips: event.target.checked })}
                                    />
                                    <span>Weekly coffee tips & offers</span>
                                </label>
                                <label className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        checked={form.newsletterTopics.newProducts}
                                        onChange={event => updateField('newsletterTopics', { ...form.newsletterTopics, newProducts: event.target.checked })}
                                    />
                                    <span>New product announcements</span>
                                </label>
                                <label className="checkbox-row">
                                    <input
                                        type="checkbox"
                                        checked={form.newsletterTopics.tutorials}
                                        onChange={event => updateField('newsletterTopics', { ...form.newsletterTopics, tutorials: event.target.checked })}
                                    />
                                    <span>Coffee brewing tutorials</span>
                                </label>
                            </div>

                            <div className="two-column-grid">
                                <label className="floating-field">
                                    <span>Language</span>
                                    <select value={form.language} onChange={event => updateField('language', event.target.value)}>
                                        <option>English</option>
                                        <option>Amharic</option>
                                    </select>
                                </label>
                                <label className="floating-field">
                                    <span>Timezone</span>
                                    <select value={form.timezone} onChange={event => updateField('timezone', event.target.value)}>
                                        <option value="EAT">EAT</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </label>
                            </div>

                            <label className="floating-field">
                                <span>Referral Code (Optional)</span>
                                <input value={form.referredByCode} onChange={event => updateField('referredByCode', event.target.value.toUpperCase())} placeholder="Enter referral code" />
                                <small>Both referrer and referee receive 50 ETB off the first order.</small>
                            </label>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="auth-form">
                            <div className="mini-card">
                                <h3>Verification</h3>
                                <p>Email and phone OTP codes will be issued automatically after registration.</p>
                                <div className="verification-preview-grid">
                                    <div>
                                        <strong>Email OTP</strong>
                                        <span>6-digit code, expires in 5 minutes</span>
                                    </div>
                                    <div>
                                        <strong>Phone OTP</strong>
                                        <span>SMS-ready flow with resend after 60 seconds</span>
                                    </div>
                                </div>
                            </div>

                            <label className="checkbox-row">
                                <input type="checkbox" checked={form.agreeTerms} onChange={event => updateField('agreeTerms', event.target.checked)} />
                                <span>I agree to Terms & Conditions</span>
                            </label>
                            <label className="checkbox-row">
                                <input type="checkbox" checked={form.isAdult} onChange={event => updateField('isAdult', event.target.checked)} />
                                <span>I am 18+ years old</span>
                            </label>
                            <div className="auth-alert success">WELCOME20 will be shown on the success screen after account creation.</div>
                        </div>
                    )}

                    {error && <p className="form-error">{error}</p>}

                    <div className="auth-action-row">
                        {step > 1 && (
                            <button type="button" className="secondary-action-button" onClick={() => setStep(current => current - 1)}>
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button type="button" className="auth-primary-button" onClick={nextStep}>
                                Continue →
                            </button>
                        ) : (
                            <button type="submit" className="auth-primary-button" disabled={loading || !form.isAdult || !form.agreeTerms}>
                                {loading ? 'Creating account...' : 'Create Account →'}
                            </button>
                        )}
                    </div>

                    <p className="auth-footer-copy">
                        Already have an account? <Link href="/login">Sign In →</Link>
                    </p>
                </form>
            </section>
        </Layout>
    );
}
