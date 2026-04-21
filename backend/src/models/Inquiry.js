const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    inquiryId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    orderNumber: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    attachments: [{ type: String }],
    preferredContact: { type: String, default: 'Email' },
    bestTimeToContact: { type: String, default: 'Any time' },
    newsletterSignup: { type: Boolean, default: false },
    status: { type: String, default: 'New' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipAddress: { type: String },
    userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
