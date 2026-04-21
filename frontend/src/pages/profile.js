import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
    addAddress,
    applyReferral,
    changePassword,
    deleteAddress,
    fetchLoyalty,
    fetchSessions,
    fetchUserOrders,
    fetchWishlist,
    updateAddress,
    updateProfile,
} from '../utils/api';
import { AUTH_TABS, formatCurrency, formatDate } from '../utils/auth';

const defaultAddress = {
    type: 'Home',
    fullName: '',
    phone: '',
    region: '',
    subCity: '',
    houseNumber: '',
    landmark: '',
    isDefault: false,
};

export default function Profile() {
    const router = useRouter();
    const { user, token, hydrated, refreshProfile, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState(AUTH_TABS[0]);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loyalty, setLoyalty] = useState(null);
    const [addressForm, setAddressForm] = useState(defaultAddress);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [profileState, setProfileState] = useState({ loading: false, message: '', error: '' });
    const [passwordState, setPasswordState] = useState({ currentPassword: '', newPassword: '', message: '', error: '', loading: false });
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        if (hydrated && !token) {
            router.replace('/login');
        }
    }, [hydrated, token, router]);

    useEffect(() => {
        if (!token) {
            setOrders([]);
            setWishlist([]);
            setSessions([]);
            setLoyalty(null);
            return;
        }

        let active = true;

        const loadAccountData = async () => {
            const profile = await refreshProfile().catch(() => null);

            if (!active || !profile) {
                return;
            }

            const [ordersResponse, wishlistResponse, sessionsResponse, loyaltyResponse] = await Promise.allSettled([
                fetchUserOrders(),
                fetchWishlist(),
                fetchSessions(),
                fetchLoyalty(),
            ]);

            if (!active) {
                return;
            }

            setOrders(ordersResponse.status === 'fulfilled' ? ordersResponse.value.data : []);
            setWishlist(wishlistResponse.status === 'fulfilled' ? wishlistResponse.value.data : []);
            setSessions(sessionsResponse.status === 'fulfilled' ? sessionsResponse.value.data : []);
            setLoyalty(loyaltyResponse.status === 'fulfilled' ? loyaltyResponse.value.data : null);
        };

        loadAccountData();

        return () => {
            active = false;
        };
        // Intentionally keyed to token so we fetch once per session bootstrap.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const displayName = user?.fullName || user?.name || 'Kaloss Member';

    const orderSummary = useMemo(() => {
        const totalSpent = orders.reduce((sum, order) => sum + (order.summary?.totalETB || 0), 0);
        return {
            count: orders.length,
            totalSpent,
            pending: orders.filter(order => order.orderStatus === 'Pending').length,
        };
    }, [orders]);

    const saveProfile = async () => {
        setProfileState({ loading: true, message: '', error: '' });
        try {
            const { data } = await updateProfile({
                fullName: user.fullName,
                phone: user.phone,
                profilePicture: user.profilePicture,
                preferredRoast: user.preferredRoast,
                language: user.language,
                timezone: user.timezone,
                newsletterSubscribed: user.newsletterSubscribed,
                newsletterTopics: user.newsletterTopics,
                emailPreferences: user.emailPreferences,
                smsPreferences: user.smsPreferences,
                webPushNotifications: user.webPushNotifications,
                darkMode: user.darkMode,
            });
            setUser(data.user);
            setProfileState({ loading: false, message: 'Profile updated successfully.', error: '' });
        } catch (error) {
            setProfileState({ loading: false, message: '', error: error.response?.data?.message || 'Profile update failed.' });
        }
    };

    const savePassword = async () => {
        setPasswordState(previous => ({ ...previous, loading: true, message: '', error: '' }));
        try {
            const { data } = await changePassword({
                currentPassword: passwordState.currentPassword,
                newPassword: passwordState.newPassword,
            });
            setPasswordState({ currentPassword: '', newPassword: '', message: data.message, error: '', loading: false });
        } catch (error) {
            setPasswordState(previous => ({
                ...previous,
                loading: false,
                error: error.response?.data?.message || 'Password change failed.',
            }));
        }
    };

    const handleAddressSave = async () => {
        try {
            const response = editingAddressId
                ? await updateAddress(editingAddressId, addressForm)
                : await addAddress(addressForm);
            setUser(previous => ({ ...previous, addresses: response.data }));
            setAddressForm(defaultAddress);
            setEditingAddressId(null);
        } catch (error) {
            setProfileState(previous => ({ ...previous, error: error.response?.data?.message || 'Address save failed.' }));
        }
    };

    const handleAddressDelete = async id => {
        const { data } = await deleteAddress(id);
        setUser(previous => ({ ...previous, addresses: data }));
    };

    const handleApplyReferral = async () => {
        try {
            await applyReferral({ code: referralCode });
            const { data } = await fetchLoyalty();
            setLoyalty(data);
            setReferralCode('');
        } catch (error) {
            setProfileState(previous => ({ ...previous, error: error.response?.data?.message || 'Referral code could not be applied.' }));
        }
    };

    if (!hydrated || !token || !user) {
        return (
            <Layout title="Profile">
                <div className="profile-loading-state">Loading your Kaloss profile...</div>
            </Layout>
        );
    }

    return (
        <Layout title="Kaloss Coffee Profile">
            <section className="profile-shell">
                <div className="profile-hero">
                    <div>
                        <p className="auth-eyebrow">Account Dashboard</p>
                        <h1>{displayName}</h1>
                        <p>Manage your account, address book, security posture, and loyalty rewards from one Ethiopian coffee dashboard.</p>
                    </div>
                    <div className="profile-hero-stats">
                        <article>
                            <strong>{orderSummary.count}</strong>
                            <span>Orders placed</span>
                        </article>
                        <article>
                            <strong>{formatCurrency(orderSummary.totalSpent)}</strong>
                            <span>Total spent</span>
                        </article>
                        <article>
                            <strong>{loyalty?.points || user.loyaltyPoints}</strong>
                            <span>Loyalty points</span>
                        </article>
                    </div>
                </div>

                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        {AUTH_TABS.map(tab => (
                            <button
                                key={tab}
                                type="button"
                                className={`profile-tab-button ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </aside>

                    <div className="profile-content-card">
                        {activeTab === 'Account Information' && (
                            <div className="profile-panel-grid">
                                <section className="mini-card">
                                    <h3>Account Information</h3>
                                    <div className="auth-form">
                                        <label className="floating-field">
                                            <span>Profile Picture URL</span>
                                            <input value={user.profilePicture || ''} onChange={event => setUser(previous => ({ ...previous, profilePicture: event.target.value }))} />
                                        </label>
                                        <label className="floating-field">
                                            <span>Full Name</span>
                                            <input value={user.fullName || ''} onChange={event => setUser(previous => ({ ...previous, fullName: event.target.value }))} />
                                        </label>
                                        <label className="floating-field">
                                            <span>Email Address</span>
                                            <input value={user.email || ''} disabled />
                                        </label>
                                        <label className="floating-field">
                                            <span>Phone Number</span>
                                            <input value={user.phone || ''} onChange={event => setUser(previous => ({ ...previous, phone: event.target.value }))} />
                                        </label>
                                        <div className="two-column-grid">
                                            <label className="floating-field">
                                                <span>Preferred Roast</span>
                                                <select value={user.preferredRoast || 'Medium'} onChange={event => setUser(previous => ({ ...previous, preferredRoast: event.target.value }))}>
                                                    <option>Light</option>
                                                    <option>Medium</option>
                                                    <option>Dark</option>
                                                </select>
                                            </label>
                                            <label className="floating-field">
                                                <span>Language</span>
                                                <select value={user.language || 'English'} onChange={event => setUser(previous => ({ ...previous, language: event.target.value }))}>
                                                    <option>English</option>
                                                    <option>Amharic</option>
                                                </select>
                                            </label>
                                        </div>
                                        <label className="floating-field">
                                            <span>Timezone</span>
                                            <select value={user.timezone || 'EAT'} onChange={event => setUser(previous => ({ ...previous, timezone: event.target.value }))}>
                                                <option value="EAT">EAT</option>
                                                <option value="UTC">UTC</option>
                                            </select>
                                        </label>
                                        <button type="button" className="auth-primary-button" onClick={saveProfile} disabled={profileState.loading}>
                                            {profileState.loading ? 'Saving...' : 'Save profile'}
                                        </button>
                                        {profileState.message && <p className="form-success">{profileState.message}</p>}
                                        {profileState.error && <p className="form-error">{profileState.error}</p>}
                                    </div>
                                </section>

                                <section className="mini-card">
                                    <h3>Change Password</h3>
                                    <div className="auth-form">
                                        <input
                                            type="password"
                                            placeholder="Current password"
                                            value={passwordState.currentPassword}
                                            onChange={event => setPasswordState(previous => ({ ...previous, currentPassword: event.target.value }))}
                                        />
                                        <input
                                            type="password"
                                            placeholder="New secure password"
                                            value={passwordState.newPassword}
                                            onChange={event => setPasswordState(previous => ({ ...previous, newPassword: event.target.value }))}
                                        />
                                        <button type="button" className="secondary-action-button" onClick={savePassword} disabled={passwordState.loading}>
                                            {passwordState.loading ? 'Updating...' : 'Update password'}
                                        </button>
                                        {passwordState.message && <p className="form-success">{passwordState.message}</p>}
                                        {passwordState.error && <p className="form-error">{passwordState.error}</p>}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'Order History' && (
                            <section className="mini-card">
                                <h3>Order History</h3>
                                <div className="data-list">
                                    {orders.length === 0 && <p>No orders yet.</p>}
                                    {orders.map(order => (
                                        <article key={order._id} className="data-row">
                                            <div>
                                                <strong>{order.orderNumber}</strong>
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                            <div>
                                                <strong>{order.orderStatus}</strong>
                                                <span>{formatCurrency(order.summary?.totalETB)}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'Saved Addresses' && (
                            <section className="profile-panel-grid">
                                <div className="mini-card">
                                    <h3>{editingAddressId ? 'Edit Address' : 'Add Address'}</h3>
                                    <div className="auth-form">
                                        <div className="two-column-grid">
                                            <input placeholder="Address type" value={addressForm.type} onChange={event => setAddressForm(previous => ({ ...previous, type: event.target.value }))} />
                                            <input placeholder="Recipient full name" value={addressForm.fullName} onChange={event => setAddressForm(previous => ({ ...previous, fullName: event.target.value }))} />
                                        </div>
                                        <div className="two-column-grid">
                                            <input placeholder="Phone number" value={addressForm.phone} onChange={event => setAddressForm(previous => ({ ...previous, phone: event.target.value }))} />
                                            <input placeholder="Region" value={addressForm.region} onChange={event => setAddressForm(previous => ({ ...previous, region: event.target.value }))} />
                                        </div>
                                        <div className="two-column-grid">
                                            <input placeholder="Sub-city" value={addressForm.subCity} onChange={event => setAddressForm(previous => ({ ...previous, subCity: event.target.value }))} />
                                            <input placeholder="House number" value={addressForm.houseNumber} onChange={event => setAddressForm(previous => ({ ...previous, houseNumber: event.target.value }))} />
                                        </div>
                                        <input placeholder="Landmark" value={addressForm.landmark} onChange={event => setAddressForm(previous => ({ ...previous, landmark: event.target.value }))} />
                                        <label className="checkbox-row">
                                            <input type="checkbox" checked={addressForm.isDefault} onChange={event => setAddressForm(previous => ({ ...previous, isDefault: event.target.checked }))} />
                                            <span>Set as default address</span>
                                        </label>
                                        <button type="button" className="auth-primary-button" onClick={handleAddressSave}>
                                            {editingAddressId ? 'Update address' : 'Add address'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mini-card">
                                    <h3>Saved Addresses</h3>
                                    <div className="data-list">
                                        {(user.addresses || []).map(address => (
                                            <article key={address._id} className="data-row stacked">
                                                <div>
                                                    <strong>{address.type} {address.isDefault ? '• Default' : ''}</strong>
                                                    <span>{address.fullName}, {address.region}, {address.subCity}, {address.houseNumber}</span>
                                                </div>
                                                <div className="inline-actions">
                                                    <button type="button" className="text-link-button" onClick={() => {
                                                        setAddressForm(address);
                                                        setEditingAddressId(address._id);
                                                    }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button type="button" className="text-link-button" onClick={() => handleAddressDelete(address._id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Payment Methods' && (
                            <section className="mini-card">
                                <h3>Payment Methods</h3>
                                <div className="data-list">
                                    {(user.paymentMethods || []).length === 0 && <p>No payment methods saved yet.</p>}
                                    {(user.paymentMethods || []).map(method => (
                                        <article key={method._id} className="data-row">
                                            <div>
                                                <strong>{method.type}</strong>
                                                <span>{method.brand || method.label || method.telebirrNumber || 'Saved payment method'}</span>
                                            </div>
                                            <div>
                                                <strong>{method.last4 ? `•••• ${method.last4}` : 'Tokenized'}</strong>
                                                <span>{method.isDefault ? 'Default' : 'Optional'}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'Wishlist' && (
                            <section className="mini-card">
                                <h3>Wishlist</h3>
                                <div className="data-list">
                                    {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
                                    {wishlist.map(item => (
                                        <article key={item._id} className="data-row">
                                            <div>
                                                <strong>{item.name}</strong>
                                                <span>{item.origin || 'Kaloss selection'}</span>
                                            </div>
                                            <div>
                                                <strong>{formatCurrency(item.priceETB)}</strong>
                                                <span>Move to cart ready</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'Preferences' && (
                            <section className="profile-panel-grid">
                                <div className="mini-card">
                                    <h3>Email & SMS Notifications</h3>
                                    <div className="auth-form">
                                        {Object.entries(user.emailPreferences || {}).map(([key, value]) => (
                                            <label key={key} className="checkbox-row">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={event => setUser(previous => ({
                                                        ...previous,
                                                        emailPreferences: { ...previous.emailPreferences, [key]: event.target.checked },
                                                    }))}
                                                />
                                                <span>{key}</span>
                                            </label>
                                        ))}
                                        {Object.entries(user.smsPreferences || {}).map(([key, value]) => (
                                            <label key={key} className="checkbox-row">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={event => setUser(previous => ({
                                                        ...previous,
                                                        smsPreferences: { ...previous.smsPreferences, [key]: event.target.checked },
                                                    }))}
                                                />
                                                <span>{key}</span>
                                            </label>
                                        ))}
                                        <label className="checkbox-row">
                                            <input type="checkbox" checked={user.darkMode || false} onChange={event => setUser(previous => ({ ...previous, darkMode: event.target.checked }))} />
                                            <span>Dark mode preference</span>
                                        </label>
                                        <label className="checkbox-row">
                                            <input type="checkbox" checked={user.webPushNotifications || false} onChange={event => setUser(previous => ({ ...previous, webPushNotifications: event.target.checked }))} />
                                            <span>Push notifications</span>
                                        </label>
                                        <button type="button" className="auth-primary-button" onClick={saveProfile}>Save preferences</button>
                                    </div>
                                </div>

                                <div className="mini-card">
                                    <h3>Referral</h3>
                                    <p>Your referral code: <strong>{user.referralCode}</strong></p>
                                    <div className="otp-inline-grid">
                                        <input value={referralCode} onChange={event => setReferralCode(event.target.value.toUpperCase())} placeholder="Apply a referral code" />
                                        <button type="button" className="secondary-action-button" onClick={handleApplyReferral}>Apply</button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Security' && (
                            <section className="profile-panel-grid">
                                <div className="mini-card">
                                    <h3>Security</h3>
                                    <div className="data-list">
                                        <article className="data-row">
                                            <div>
                                                <strong>Two-Factor Authentication</strong>
                                                <span>{user.twoFactorEnabled ? 'Enabled' : 'Not enabled yet'}</span>
                                            </div>
                                            <button type="button" className="secondary-action-button" onClick={() => router.push('/profile/security/2fa')}>
                                                Manage 2FA
                                            </button>
                                        </article>
                                        <article className="data-row">
                                            <div>
                                                <strong>Email verified</strong>
                                                <span>{user.isEmailVerified ? 'Verified' : 'Pending verification'}</span>
                                            </div>
                                            <button type="button" className="text-link-button" onClick={() => router.push('/verify-email')}>
                                                Verify now
                                            </button>
                                        </article>
                                    </div>
                                </div>
                                <div className="mini-card">
                                    <h3>Active Sessions</h3>
                                    <div className="data-list">
                                        {sessions.map(session => (
                                            <article key={session._id} className="data-row stacked">
                                                <div>
                                                    <strong>{session.deviceInfo || 'Browser session'}</strong>
                                                    <span>{session.location} • {formatDate(session.createdAt)}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                                <div className="mini-card">
                                    <h3>Login History</h3>
                                    <div className="data-list">
                                        {(user.loginHistory || []).map(item => (
                                            <article key={item._id} className="data-row stacked">
                                                <div>
                                                    <strong>{item.deviceInfo || 'Browser'}</strong>
                                                    <span>{item.location} • {formatDate(item.loggedInAt)}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'Loyalty Program' && (
                            <section className="profile-panel-grid">
                                <div className="mini-card">
                                    <h3>Loyalty Snapshot</h3>
                                    <div className="loyalty-grid">
                                        <article>
                                            <strong>{loyalty?.points || 0}</strong>
                                            <span>Points balance</span>
                                        </article>
                                        <article>
                                            <strong>{loyalty?.tier || 'Bronze'}</strong>
                                            <span>Tier status</span>
                                        </article>
                                        <article>
                                            <strong>{loyalty?.nextTierAt ? `${loyalty.nextTierAt} pts` : 'Top tier'}</strong>
                                            <span>Next milestone</span>
                                        </article>
                                    </div>
                                </div>
                                <div className="mini-card">
                                    <h3>Points History</h3>
                                    <div className="data-list">
                                        {(loyalty?.history || []).map(entry => (
                                            <article key={`${entry.label}-${entry.date}`} className="data-row">
                                                <div>
                                                    <strong>{entry.label}</strong>
                                                    <span>{formatDate(entry.date)}</span>
                                                </div>
                                                <div>
                                                    <strong>{entry.points} pts</strong>
                                                    <span>{entry.points >= 1000 ? 'Reward-ready' : 'Keep brewing'}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
