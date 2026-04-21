const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionToken: { type: String, required: true, unique: true },
    deviceInfo: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    location: { type: String, default: 'Unknown' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
