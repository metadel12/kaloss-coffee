const mongoose = require('mongoose');

const wholesaleInquirySchema = new mongoose.Schema({
    inquiryId: { type: String, required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    businessType: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    monthlyQuantity: { type: String, required: true, trim: true },
    coffeeTypes: [{ type: String }],
    roastPreference: { type: String, trim: true },
    packagingPreference: { type: String, trim: true },
    currentSupplier: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    sampleRequested: { type: Boolean, default: false },
    status: { type: String, default: 'New' },
    quotedPrice: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('WholesaleInquiry', wholesaleInquirySchema);
