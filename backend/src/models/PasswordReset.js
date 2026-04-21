const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    ipAddress: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
