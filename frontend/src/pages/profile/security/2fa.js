import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import { disableTwoFactor, enableTwoFactor, verifyTwoFactorSetup } from '../../../utils/api';

export default function TwoFactorSetupPage() {
    const router = useRouter();
    const { token, user, refreshProfile } = useAuth();
    const [setup, setSetup] = useState(null);
    const [code, setCode] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [state, setState] = useState({ loading: false, message: '', error: '' });

    useEffect(() => {
        if (!token) router.replace('/login');
    }, [token, router]);

    const beginSetup = async () => {
        setState({ loading: true, message: '', error: '' });
        try {
            const { data } = await enableTwoFactor();
            setSetup(data);
            setBackupCodes(data.backupCodesPreview || []);
            setState({ loading: false, message: 'Secret generated. Demo verification code is the first 6 characters of the secret.', error: '' });
        } catch (error) {
            setState({ loading: false, message: '', error: error.response?.data?.message || 'Unable to start 2FA setup.' });
        }
    };

    const finishSetup = async () => {
        setState({ loading: true, message: '', error: '' });
        try {
            const { data } = await verifyTwoFactorSetup({ code });
            setBackupCodes(data.backupCodes || []);
            await refreshProfile();
            setState({ loading: false, message: data.message, error: '' });
        } catch (error) {
            setState({ loading: false, message: '', error: error.response?.data?.message || 'Could not enable 2FA.' });
        }
    };

    const turnOff2fa = async () => {
        setState({ loading: true, message: '', error: '' });
        try {
            const { data } = await disableTwoFactor();
            await refreshProfile();
            setSetup(null);
            setBackupCodes([]);
            setCode('');
            setState({ loading: false, message: data.message, error: '' });
        } catch (error) {
            setState({ loading: false, message: '', error: error.response?.data?.message || 'Could not disable 2FA.' });
        }
    };

    return (
        <Layout title="Two-Factor Authentication Setup">
            <section className="single-auth-page">
                <div className="auth-card centered">
                    <div className="auth-card-header">
                        <div className="auth-badge">🔐</div>
                        <h1>Two-Factor Authentication</h1>
                        <p>Scan the QR payload, verify a 6-digit code, and keep backup codes in a safe place.</p>
                    </div>

                    <div className="mini-card">
                        <h3>Current status</h3>
                        <p>{user?.twoFactorEnabled ? 'Two-factor authentication is enabled.' : 'Two-factor authentication is not enabled yet.'}</p>
                    </div>

                    {!setup && !user?.twoFactorEnabled && (
                        <button type="button" className="auth-primary-button" onClick={beginSetup} disabled={state.loading}>
                            {state.loading ? 'Preparing...' : 'Start 2FA setup'}
                        </button>
                    )}

                    {setup && (
                        <div className="auth-form">
                            <div className="mini-card">
                                <h3>1. Scan QR code payload</h3>
                                <p className="code-block">{setup.qrCodeUri}</p>
                                <p>Secret: <strong>{setup.secret}</strong></p>
                            </div>
                            <div className="mini-card">
                                <h3>2. Enter verification code</h3>
                                <input value={code} onChange={event => setCode(event.target.value)} placeholder="Enter 6-digit code" />
                                <button type="button" className="secondary-action-button" onClick={finishSetup} disabled={state.loading || code.length < 6}>
                                    {state.loading ? 'Verifying...' : 'Verify and enable'}
                                </button>
                            </div>
                        </div>
                    )}

                    {backupCodes.length > 0 && (
                        <div className="mini-card">
                            <h3>3. Backup codes</h3>
                            <div className="backup-grid">
                                {backupCodes.map(item => <span key={item}>{item}</span>)}
                            </div>
                        </div>
                    )}

                    {user?.twoFactorEnabled && (
                        <button type="button" className="secondary-action-button danger" onClick={turnOff2fa} disabled={state.loading}>
                            Disable 2FA
                        </button>
                    )}

                    {state.message && <p className="form-success">{state.message}</p>}
                    {state.error && <p className="form-error">{state.error}</p>}
                </div>
            </section>
        </Layout>
    );
}
