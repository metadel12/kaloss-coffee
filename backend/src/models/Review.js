const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productSlug: { type: String },
    title: { type: String },
    username: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    location: { type: String },
    language: { type: String, default: 'en' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
