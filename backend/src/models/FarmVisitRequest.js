const mongoose = require('mongoose');

const farmVisitRequestSchema = new mongoose.Schema({
    inquiryId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    visitors: { type: Number, default: 1 },
    preferredDates: { type: String, trim: true },
    regionPreference: { type: String, trim: true },
    purpose: { type: String, trim: true },
    specialRequirements: { type: String, trim: true },
    budget: { type: String, trim: true },
    status: { type: String, default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('FarmVisitRequest', farmVisitRequestSchema);
