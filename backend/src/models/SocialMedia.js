const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform: { type: String, required: true, index: true },
    url: { type: String, required: true },
    username: { type: String, required: true },
    followerCount: { type: Number, default: 0 },
    icon: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
