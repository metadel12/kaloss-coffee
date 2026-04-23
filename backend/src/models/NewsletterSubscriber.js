const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    location: { type: String },
    source: { type: String, default: 'homepage' },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
