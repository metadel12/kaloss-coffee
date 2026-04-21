const User = require('../models/User');
const OTP = require('../models/OTP');
const Session = require('../models/Session');
const PasswordReset = require('../models/PasswordReset');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    generateOtpCode,
    hashValue,
    randomToken,
    parseCookies,
} = require('../utils/authTokens');
const { sendEmail } = require('../utils/sendEmail');

const loginThrottle = new Map();
const THROTTLE_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS_PER_WINDOW = 5;

const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
const isValidEthiopianPhone = value => /^(\+251|0)9\d{8}$/.test((value || '').replace(/\s+/g, ''));
const normalizeName = value => String(value || '').trim();
const normalizePhone = value => {
    const cleaned = (value || '').replace(/\s+/g, '');
    if (cleaned.startsWith('0')) return `+251${cleaned.slice(1)}`;
    return cleaned;
};
const normalizeIdentifier = identifier => {
    if (!identifier) return '';
    if (identifier.includes('@')) return identifier.trim().toLowerCase();
    return normalizePhone(identifier);
};
const getClientIp = req => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || '';
const getLocationLabel = req => req.headers['x-kaloss-location'] || 'Unknown';
const getDeviceInfo = req => req.headers['sec-ch-ua-platform'] || 'Web Browser';

const sanitizeUser = user => ({
    _id: user._id,
    name: user.name || user.fullName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    profilePicture: user.profilePicture,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    isActive: user.isActive,
    role: user.role,
    preferredRoast: user.preferredRoast,
    language: user.language,
    timezone: user.timezone,
    newsletterSubscribed: user.newsletterSubscribed,
    newsletterTopics: user.newsletterTopics,
    emailPreferences: user.emailPreferences,
    smsPreferences: user.smsPreferences,
    webPushNotifications: user.webPushNotifications,
    darkMode: user.darkMode,
    twoFactorEnabled: user.twoFactorEnabled,
    referralCode: user.referralCode,
    loyaltyPoints: user.loyaltyPoints,
    loyaltyTier: user.loyaltyTier,
    totalSpent: user.totalSpent,
    addresses: user.addresses,
    paymentMethods: user.paymentMethods,
    wishlist: user.wishlist,
    connectedAccounts: user.connectedAccounts,
    loginHistory: user.loginHistory,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const setRefreshCookie = (res, token) => {
    const cookie = [
        `refreshToken=${encodeURIComponent(token)}`,
        'HttpOnly',
        'Path=/',
        'SameSite=Lax',
        `Max-Age=${7 * 24 * 60 * 60}`,
    ];

    if (process.env.NODE_ENV === 'production') cookie.push('Secure');
    res.setHeader('Set-Cookie', cookie.join('; '));
};

const clearRefreshCookie = res => {
    const cookie = ['refreshToken=', 'HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0'];
    if (process.env.NODE_ENV === 'production') cookie.push('Secure');
    res.setHeader('Set-Cookie', cookie.join('; '));
};

const getThrottleState = key => {
    const now = Date.now();
    const current = loginThrottle.get(key);
    if (!current || current.resetAt < now) {
        const fresh = { count: 0, resetAt: now + THROTTLE_WINDOW_MS };
        loginThrottle.set(key, fresh);
        return fresh;
    }
    return current;
};

const issueSession = async (req, res, user, rememberMe = false) => {
    const sessionToken = randomToken(32);
    const session = await Session.create({
        userId: user._id,
        sessionToken: hashValue(sessionToken),
        deviceInfo: getDeviceInfo(req),
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
        location: getLocationLabel(req),
        isActive: true,
        expiresAt: new Date(Date.now() + ((rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000)),
    });

    const refreshToken = signRefreshToken(session._id.toString());
    user.fullName = normalizeName(user.fullName || user.name);
    user.name = normalizeName(user.name || user.fullName);
    user.refreshTokens = [...(user.refreshTokens || []), hashValue(refreshToken)].slice(-8);
    user.lastLogin = new Date();
    user.lastLoginIP = getClientIp(req);
    user.loginHistory.unshift({
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
        location: getLocationLabel(req),
        deviceInfo: getDeviceInfo(req),
        loggedInAt: new Date(),
    });
    user.loginHistory = user.loginHistory.slice(0, 20);
    await user.save();

    setRefreshCookie(res, refreshToken);

    return {
        user: sanitizeUser(user),
        token: signAccessToken(user._id),
        sessionId: session._id,
        expiresIn: 900,
    };
};

const sendOtpNotice = async ({ identifier, code, type }) => {
    const subjectByType = {
        email: 'Your Kaloss Coffee verification code',
        phone: 'Kaloss Coffee phone verification code',
        login: 'Your Kaloss Coffee login code',
        reset: 'Your Kaloss Coffee password reset code',
        '2fa': 'Your Kaloss Coffee two-factor code',
    };

    const message = `Your verification code is ${code}. It expires in 5 minutes.`;
    await sendEmail({ to: identifier, subject: subjectByType[type] || 'Kaloss Coffee OTP', message });
};

const createOtpRecord = async ({ identifier, type }) => {
    const code = generateOtpCode();
    await OTP.deleteMany({ identifier, type });
    await OTP.create({
        identifier,
        type,
        code: hashValue(code),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendOtpNotice({ identifier, code, type });
    return code;
};

exports.registerUser = async (req, res) => {
    const {
        fullName,
        name,
        email,
        phone,
        password,
        preferredRoast,
        language,
        timezone,
        newsletterSubscribed,
        newsletterTopics,
        referredByCode,
    } = req.body;

    const normalizedFullName = normalizeName(fullName || name);
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone ? normalizePhone(phone) : '';

    if (!normalizedFullName) return res.status(400).json({ message: 'Full name is required.' });
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) return res.status(400).json({ message: 'A valid email is required.' });
    if (!normalizedPhone || !isValidEthiopianPhone(normalizedPhone)) return res.status(400).json({ message: 'Use a valid Ethiopian phone number.' });
    if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
        return res.status(400).json({ message: 'Password must meet the security requirements.' });
    }

    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });
    if (existingUser) return res.status(400).json({ message: 'Email or phone is already registered.' });

    let referredBy = null;
    if (referredByCode) {
        const referrer = await User.findOne({ referralCode: referredByCode.trim().toUpperCase() });
        if (referrer) referredBy = referrer._id;
    }

    const user = await User.create({
        fullName: normalizedFullName,
        name: normalizedFullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password,
        preferredRoast: preferredRoast || 'Medium',
        language: language || 'English',
        timezone: timezone || 'EAT',
        newsletterSubscribed: newsletterSubscribed !== false,
        newsletterTopics: {
            weeklyTips: newsletterTopics?.weeklyTips !== false,
            newProducts: newsletterTopics?.newProducts !== false,
            tutorials: Boolean(newsletterTopics?.tutorials),
        },
        referredBy,
        loyaltyPoints: 20,
    });

    await createOtpRecord({ identifier: normalizedEmail, type: 'email' });
    await createOtpRecord({ identifier: normalizedPhone, type: 'phone' });

    const auth = await issueSession(req, res, user, true);
    res.status(201).json({
        ...auth,
        message: 'Account created successfully.',
        welcomeOffer: {
            code: 'WELCOME20',
            discount: '20% off your first order',
        },
    });
};

exports.loginUser = async (req, res) => {
    const { identifier, email, phone, password, rememberMe } = req.body;
    const loginIdentifier = normalizeIdentifier(identifier || email || phone);
    const throttleKey = `${getClientIp(req)}:${loginIdentifier}`;
    const throttleState = getThrottleState(throttleKey);

    if (throttleState.count >= MAX_FAILED_ATTEMPTS_PER_WINDOW) {
        return res.status(429).json({ message: 'Too many failed attempts. Try again in 15 minutes.' });
    }

    const query = isValidEmail(loginIdentifier) ? { email: loginIdentifier } : { phone: loginIdentifier };
    const user = await User.findOne(query);

    if (!user) {
        throttleState.count += 1;
        return res.status(401).json({
            message: 'Invalid credentials.',
            failedAttempts: throttleState.count,
            captchaRequired: throttleState.count >= 3,
        });
    }

    if (user.isLocked) {
        return res.status(423).json({ message: 'Account locked for 30 minutes after repeated failed attempts.' });
    }

    const isMatch = await user.matchPassword(password || '');
    if (!isMatch) {
        throttleState.count += 1;
        await user.incrementLoginAttempts();
        return res.status(401).json({
            message: 'Invalid credentials.',
            failedAttempts: throttleState.count,
            captchaRequired: throttleState.count >= 3,
            remainingBeforeLock: Math.max(0, 10 - user.loginAttempts),
        });
    }

    throttleState.count = 0;
    await user.resetLoginAttempts();

    if (user.twoFactorEnabled) {
        await createOtpRecord({ identifier: user.email, type: '2fa' });
        return res.status(200).json({
            requiresTwoFactor: true,
            mfaOptions: ['SMS OTP', 'Email OTP', 'Authenticator App'],
            trustedDeviceEligible: true,
            identifier: user.email,
            backupCodeCount: 8,
        });
    }

    const auth = await issueSession(req, res, user, Boolean(rememberMe));
    return res.json(auth);
};

exports.requestLoginOtp = async (req, res) => {
    const { identifier } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const query = isValidEmail(normalized) ? { email: normalized } : { phone: normalized };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: 'No account found for that email or phone number.' });

    await createOtpRecord({ identifier: normalized, type: 'login' });
    return res.json({
        message: `OTP sent to ${normalized}.`,
        resendAfter: 60,
        expiresIn: 300,
    });
};

exports.verifyLoginOtp = async (req, res) => {
    const { identifier, code, rememberMe } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const otp = await OTP.findOne({ identifier: normalized, type: 'login', verifiedAt: null }).sort({ createdAt: -1 });

    if (!otp) return res.status(400).json({ message: 'OTP not found. Request a new code.' });
    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP has expired.' });
    if (otp.code !== hashValue(code || '')) {
        otp.attempts += 1;
        await otp.save();
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    otp.verifiedAt = new Date();
    await otp.save();

    const query = isValidEmail(normalized) ? { email: normalized } : { phone: normalized };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const auth = await issueSession(req, res, user, Boolean(rememberMe));
    return res.json(auth);
};

exports.logoutUser = async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
        const hashedRefreshToken = hashValue(refreshToken);
        const user = await User.findOne({ refreshTokens: hashedRefreshToken });
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(token => token !== hashedRefreshToken);
            await user.save();
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);
            await Session.findByIdAndUpdate(decoded.sid, { isActive: false });
        } catch (error) {
            // Ignore invalid refresh tokens on logout.
        }
    }

    clearRefreshCookie(res);
    return res.json({ message: 'Logged out successfully.' });
};

exports.refreshAuthToken = async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing.' });

    const hashedRefreshToken = hashValue(refreshToken);

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        return res.status(401).json({ message: 'Refresh token invalid.' });
    }

    const session = await Session.findById(decoded.sid);
    if (!session || !session.isActive || session.expiresAt < new Date()) {
        return res.status(401).json({ message: 'Session expired.' });
    }

    const user = await User.findOne({ _id: session.userId, refreshTokens: hashedRefreshToken });
    if (!user) return res.status(401).json({ message: 'Refresh token not recognized.' });

    return res.json({
        token: signAccessToken(user._id),
        user: sanitizeUser(user),
        expiresIn: 900,
    });
};

exports.forgotPassword = async (req, res) => {
    const { identifier } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const query = isValidEmail(normalized) ? { email: normalized } : { phone: normalized };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: 'No account found for that identifier.' });

    const rawToken = randomToken(24);
    await PasswordReset.create({
        userId: user._id,
        token: hashValue(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        ipAddress: getClientIp(req),
    });

    await createOtpRecord({ identifier: normalized, type: 'reset' });
    if (user.email) {
        await sendEmail({
            to: user.email,
            subject: 'Reset your Kaloss Coffee password',
            message: `Reset link: ${(process.env.FRONTEND_URL || 'http://localhost:3001')}/reset-password?token=${rawToken}`,
        });
    }

    return res.json({ message: 'Password reset instructions sent.', resetToken: rawToken });
};

exports.resetPassword = async (req, res) => {
    const { token, password, otpCode, identifier } = req.body;
    let user = null;

    if (token) {
        const resetRecord = await PasswordReset.findOne({ token: hashValue(token), usedAt: null }).sort({ createdAt: -1 });
        if (!resetRecord || resetRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Reset token is invalid or expired.' });
        }
        user = await User.findById(resetRecord.userId);
        resetRecord.usedAt = new Date();
        await resetRecord.save();
    } else if (otpCode && identifier) {
        const normalized = normalizeIdentifier(identifier);
        const otp = await OTP.findOne({ identifier: normalized, type: 'reset', verifiedAt: null }).sort({ createdAt: -1 });
        if (!otp || otp.expiresAt < new Date() || otp.code !== hashValue(otpCode)) {
            return res.status(400).json({ message: 'Reset OTP is invalid or expired.' });
        }
        otp.verifiedAt = new Date();
        await otp.save();
        const query = isValidEmail(normalized) ? { email: normalized } : { phone: normalized };
        user = await User.findOne(query);
    }

    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = password;
    user.refreshTokens = [];
    await user.save();
    await Session.updateMany({ userId: user._id }, { isActive: false });
    clearRefreshCookie(res);

    return res.json({ message: 'Password updated successfully.' });
};

exports.verifyEmail = async (req, res) => {
    const { identifier, code } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const otp = await OTP.findOne({ identifier: normalized, type: 'email', verifiedAt: null }).sort({ createdAt: -1 });
    if (!otp || otp.expiresAt < new Date() || otp.code !== hashValue(code || '')) {
        return res.status(400).json({ message: 'Email verification code is invalid or expired.' });
    }

    const user = await User.findOne({ email: normalized });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    otp.verifiedAt = new Date();
    user.isEmailVerified = true;
    await otp.save();
    await user.save();

    return res.json({ message: 'Email verified successfully.' });
};

exports.verifyPhone = async (req, res) => {
    const { identifier, code } = req.body;
    const normalized = normalizeIdentifier(identifier);
    const otp = await OTP.findOne({ identifier: normalized, type: 'phone', verifiedAt: null }).sort({ createdAt: -1 });
    if (!otp || otp.expiresAt < new Date() || otp.code !== hashValue(code || '')) {
        return res.status(400).json({ message: 'Phone verification code is invalid or expired.' });
    }

    const user = await User.findOne({ phone: normalized });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    otp.verifiedAt = new Date();
    user.isPhoneVerified = true;
    await otp.save();
    await user.save();

    return res.json({ message: 'Phone verified successfully.' });
};

exports.enableTwoFactor = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const secret = randomToken(10).toUpperCase();
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await user.save();

    return res.json({
        secret,
        qrCodeUri: `otpauth://totp/KalossCoffee:${encodeURIComponent(user.email)}?secret=${secret}&issuer=KalossCoffee`,
        backupCodesPreview: Array.from({ length: 8 }, () => randomToken(4).toUpperCase()),
    });
};

exports.verifyTwoFactorSetup = async (req, res) => {
    const { code } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !user.twoFactorSecret) return res.status(400).json({ message: 'Start 2FA setup first.' });

    const expected = user.twoFactorSecret.slice(0, 6);
    if ((code || '') !== expected) {
        return res.status(400).json({ message: 'Verification code is invalid for this demo implementation.' });
    }

    const rawBackupCodes = Array.from({ length: 8 }, () => randomToken(4).toUpperCase());
    user.backupCodes = rawBackupCodes.map(hashValue);
    user.twoFactorEnabled = true;
    await user.save();

    return res.json({ message: 'Two-factor authentication enabled.', backupCodes: rawBackupCodes });
};

exports.disableTwoFactor = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.twoFactorEnabled = false;
    user.twoFactorSecret = '';
    user.backupCodes = [];
    await user.save();

    return res.json({ message: 'Two-factor authentication disabled.' });
};
