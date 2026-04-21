const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    referenceNumber: { type: String },
    status: {
        type: String,
        enum: ['Initiated', 'Success', 'Failed', 'Refunded', 'Pending Verification'],
        default: 'Initiated',
    },
    merchantAccount: { type: mongoose.Schema.Types.Mixed, default: {} },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
}, { versionKey: false });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
