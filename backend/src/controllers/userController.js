const User = require('../models/User');
const Order = require('../models/Order');
const Session = require('../models/Session');
const { hashValue } = require('../utils/authTokens');

const sanitizeUser = user => ({
    _id: user._id,
    name: user.name || user.fullName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    profilePicture: user.profilePicture,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
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

const deriveLoyaltyTier = points => {
    if (points >= 15000) return 'Platinum';
    if (points >= 7500) return 'Gold';
    if (points >= 3000) return 'Silver';
    return 'Bronze';
};

exports.getUsers = async (req, res) => {
    const users = await User.find().select('-password -backupCodes -refreshTokens -twoFactorSecret');
    res.json(users);
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -backupCodes -refreshTokens -twoFactorSecret').populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
};

exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = req.body.fullName || user.fullName;
    user.name = user.fullName;
    user.phone = req.body.phone || user.phone;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.preferredRoast = req.body.preferredRoast || user.preferredRoast;
    user.language = req.body.language || user.language;
    user.timezone = req.body.timezone || user.timezone;
    user.newsletterSubscribed = req.body.newsletterSubscribed ?? user.newsletterSubscribed;
    user.newsletterTopics = { ...user.newsletterTopics.toObject?.(), ...(req.body.newsletterTopics || {}) };
    user.emailPreferences = { ...user.emailPreferences.toObject?.(), ...(req.body.emailPreferences || {}) };
    user.smsPreferences = { ...user.smsPreferences.toObject?.(), ...(req.body.smsPreferences || {}) };
    user.webPushNotifications = req.body.webPushNotifications ?? user.webPushNotifications;
    user.darkMode = req.body.darkMode ?? user.darkMode;

    const updated = await user.save();
    return res.json({ user: sanitizeUser(updated) });
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await user.matchPassword(currentPassword || '');
    if (!matches) return res.status(400).json({ message: 'Current password is incorrect.' });

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();
    await Session.updateMany({ userId: user._id }, { isActive: false });

    return res.json({ message: 'Password changed successfully. Please sign in again.' });
};

exports.getAddresses = async (req, res) => {
    const user = await User.findById(req.user._id).select('addresses');
    return res.json(user?.addresses || []);
};

exports.addAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = { ...req.body };
    if (address.isDefault) {
        user.addresses.forEach(item => {
            item.isDefault = false;
        });
    }
    user.addresses.push(address);
    await user.save();
    return res.status(201).json(user.addresses);
};

exports.updateAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
        user.addresses.forEach(item => {
            item.isDefault = false;
        });
    }

    Object.assign(address, req.body);
    await user.save();
    return res.json(user.addresses);
};

exports.deleteAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(address => address._id.toString() !== req.params.id);
    await user.save();
    return res.json(user.addresses);
};

exports.getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    return res.json(user?.wishlist || []);
};

exports.addToWishlist = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist.find(productId => productId.toString() === req.params.productId)) {
        user.wishlist.push(req.params.productId);
    }
    await user.save();
    const hydratedUser = await User.findById(req.user._id).populate('wishlist');
    return res.json(hydratedUser.wishlist);
};

exports.removeFromWishlist = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(productId => productId.toString() !== req.params.productId);
    await user.save();
    const hydratedUser = await User.findById(req.user._id).populate('wishlist');
    return res.json(hydratedUser.wishlist);
};

exports.getUserOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    return res.json(orders);
};

exports.getSessions = async (req, res) => {
    const sessions = await Session.find({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
    return res.json(sessions);
};

exports.terminateSession = async (req, res) => {
    const session = await Session.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isActive: false },
        { new: true }
    );

    if (!session) return res.status(404).json({ message: 'Session not found' });
    return res.json({ message: 'Session terminated.' });
};

exports.applyReferralCode = async (req, res) => {
    const { code } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.referredBy) return res.status(400).json({ message: 'Referral code already applied.' });

    const referrer = await User.findOne({ referralCode: (code || '').trim().toUpperCase() });
    if (!referrer) return res.status(404).json({ message: 'Referral code not found.' });

    user.referredBy = referrer._id;
    user.loyaltyPoints += 50;
    referrer.loyaltyPoints += 50;
    user.loyaltyTier = deriveLoyaltyTier(user.loyaltyPoints);
    referrer.loyaltyTier = deriveLoyaltyTier(referrer.loyaltyPoints);

    await user.save();
    await referrer.save();

    return res.json({ message: 'Referral code applied. 50 ETB welcome credit unlocked.' });
};

exports.getLoyalty = async (req, res) => {
    const user = await User.findById(req.user._id).select('loyaltyPoints loyaltyTier totalSpent updatedAt');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
        points: user.loyaltyPoints,
        tier: user.loyaltyTier,
        totalSpent: user.totalSpent,
        nextTierAt:
            user.loyaltyTier === 'Bronze' ? 3000
                : user.loyaltyTier === 'Silver' ? 7500
                    : user.loyaltyTier === 'Gold' ? 15000
                        : null,
        history: [
            { label: 'Welcome bonus', points: 20, date: user.createdAt },
            { label: 'Profile completion', points: 30, date: user.updatedAt },
        ],
    });
};
