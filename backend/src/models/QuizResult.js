const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    sessionId: { type: String },
    answers: [{
        questionId: { type: String },
        answer: { type: String },
    }],
    recommendation: {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        discountCode: { type: String },
        discountAmount: { type: Number },
    },
    userEmail: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
