const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const emailPreferenceSchema = new mongoose.Schema({
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    newProducts: { type: Boolean, default: true },
    coffeeTips: { type: Boolean, default: true },
}, { _id: false });

const smsPreferenceSchema = new mongoose.Schema({
    orderConfirmation: { type: Boolean, default: true },
    deliveryUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
}, { _id: false });

const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    region: { type: String, required: true },
    subCity: { type: String, default: '' },
    houseNumber: { type: String, required: true },
    landmark: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
}, { _id: true });

const paymentMethodSchema = new mongoose.Schema({
    type: { type: String, enum: ['Card', 'Telebirr', 'Bank'], required: true },
    label: { type: String, default: '' },
    last4: { type: String, default: '' },
    brand: { type: String, default: '' },
    expiryMonth: { type: Number, default: null },
    expiryYear: { type: Number, default: null },
    telebirrNumber: { type: String, default: '' },
    bankName: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
}, { _id: true });

const connectedAccountSchema = new mongoose.Schema({
    provider: { type: String, enum: ['google', 'facebook', 'telegram', 'apple'], required: true },
    providerId: { type: String, default: '' },
    connectedAt: { type: Date, default: Date.now },
}, { _id: true });

const loginHistorySchema = new mongoose.Schema({
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    location: { type: String, default: 'Unknown' },
    deviceInfo: { type: String, default: '' },
    loggedInAt: { type: Date, default: Date.now },
}, { _id: true });

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, sparse: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin', 'super_admin', 'moderator'], default: 'user' },
    isAdmin: { type: Boolean, default: false },
    permissions: [{ type: String }],
    banned: { type: Boolean, default: false },
    bannedReason: { type: String, default: '' },
    bannedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    preferredRoast: { type: String, enum: ['Light', 'Medium', 'Dark'], default: 'Medium' },
    language: { type: String, enum: ['English', 'Amharic'], default: 'English' },
    timezone: { type: String, default: 'EAT' },
    newsletterSubscribed: { type: Boolean, default: true },
    newsletterTopics: {
        weeklyTips: { type: Boolean, default: true },
        newProducts: { type: Boolean, default: true },
        tutorials: { type: Boolean, default: false },
    },
    emailPreferences: { type: emailPreferenceSchema, default: () => ({}) },
    smsPreferences: { type: smsPreferenceSchema, default: () => ({}) },
    webPushNotifications: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: '' },
    backupCodes: [{ type: String }],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    refreshTokens: [{ type: String }],
    referralCode: {
        type: String,
        unique: true,
        uppercase: true,
        default: () => crypto.randomBytes(4).toString('hex').toUpperCase(),
    },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    totalSpent: { type: Number, default: 0 },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    connectedAccounts: [connectedAccountSchema],
    loginHistory: [loginHistorySchema],
    lastLogin: { type: Date, default: null },
    lastLoginIP: { type: String, default: '' },
}, { timestamps: true });

userSchema.virtual('isLocked').get(function isLocked() {
    return Boolean(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', async function preSave(next) {
    if (this.fullName && !this.name) {
        this.name = this.fullName;
    }

    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    return next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.incrementLoginAttempts = async function incrementLoginAttempts() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.loginAttempts = 1;
        this.lockUntil = null;
        return this.save();
    }

    this.loginAttempts += 1;

    if (this.loginAttempts >= 10 && !this.isLocked) {
        this.lockUntil = new Date(Date.now() + (30 * 60 * 1000));
    }

    return this.save();
};

userSchema.methods.resetLoginAttempts = async function resetLoginAttempts() {
    if (this.loginAttempts || this.lockUntil) {
        this.loginAttempts = 0;
        this.lockUntil = null;
        await this.save();
    }
};

module.exports = mongoose.model('User', userSchema);
