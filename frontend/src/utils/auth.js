export const AUTH_TABS = [
    'Account Information',
    'Order History',
    'Saved Addresses',
    'Payment Methods',
    'Wishlist',
    'Preferences',
    'Security',
    'Loyalty Program',
];

export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
export const isEthiopianPhone = value => /^(\+251|0)9\d{8}$/.test((value || '').replace(/\s+/g, ''));
export const normalizePhone = value => {
    const cleaned = (value || '').replace(/\s+/g, '');
    if (cleaned.startsWith('0')) return `+251${cleaned.slice(1)}`;
    return cleaned;
};

export const validateIdentifier = value => isEmail(value) || isEthiopianPhone(value);

export const getPasswordChecks = value => ({
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[!@#$%^&*]/.test(value),
});

export const getPasswordStrength = value => {
    const checks = Object.values(getPasswordChecks(value)).filter(Boolean).length;
    if (checks <= 2) return { label: 'Weak', score: checks };
    if (checks === 3) return { label: 'Medium', score: checks };
    if (checks === 4) return { label: 'Strong', score: checks };
    return { label: 'Very Strong', score: checks };
};

export const formatCurrency = value => new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
}).format(value || 0);

export const formatDate = value => {
    if (!value) return 'Not available';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};
