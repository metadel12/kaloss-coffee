const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        avatar: { type: String },
        location: { type: String },
        verified: { type: Boolean, default: false },
    },
    content: {
        text: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
    },
    metadata: {
        brewMethod: { type: String },
        verifiedPurchase: { type: Boolean, default: false },
    },
    likes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
