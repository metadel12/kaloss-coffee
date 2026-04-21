const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    searchKeywords: [{ type: String }],
    featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
