const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['Percentage', 'Fixed', 'FreeShipping'], required: true },
    value: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DiscountCode', discountCodeSchema);
