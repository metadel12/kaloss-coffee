const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true, index: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['email', 'phone', '2fa', 'login', 'reset'], required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date, default: null },
    resendCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
