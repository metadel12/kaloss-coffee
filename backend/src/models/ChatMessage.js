const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sender: { type: String, required: true, enum: ['user', 'agent', 'bot'] },
    message: { type: String, required: true, trim: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
