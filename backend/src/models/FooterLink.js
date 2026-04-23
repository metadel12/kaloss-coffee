const mongoose = require('mongoose');

const footerLinkSchema = new mongoose.Schema({
    category: { type: String, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    target: { type: String, default: '_self' },
}, { timestamps: true });

module.exports = mongoose.model('FooterLink', footerLinkSchema);
