const express = require('express');
const PaymentTransaction = require('../models/PaymentTransaction');
const Order = require('../models/Order');
const { merchantAccounts } = require('../config/paymentConfig');
const router = express.Router();

const GATEWAY_URLS = {
    telebirr: 'https://telebirr.example/authorize',
    chapa: 'https://checkout.chapa.co/pay/demo',
    cbebirr: 'https://cbebirr.example/checkout',
    hellocash: 'https://hellocash.example/pay',
};

const toStatus = method => {
    if (method === 'bank_transfer') return 'Pending Verification';
    if (method === 'cod') return 'Awaiting Payment';
    return 'Processing';
};

const verifyTransaction = async ({ transactionId, status, referenceNumber, gatewayResponse }) => {
    const transaction = await PaymentTransaction.findOne({ transactionId });
    if (!transaction) {
        return null;
    }

    transaction.status = status === 'SUCCESS' ? 'Success' : status === 'FAILED' ? 'Failed' : transaction.status;
    transaction.referenceNumber = referenceNumber || transaction.referenceNumber;
    transaction.gatewayResponse = gatewayResponse || transaction.gatewayResponse;
    transaction.verifiedAt = new Date();
    await transaction.save();

    const order = await Order.findById(transaction.orderId);
    if (order) {
        order.paymentStatus = transaction.status === 'Success' ? 'Paid' : transaction.status === 'Failed' ? 'Failed' : order.paymentStatus;
        order.orderStatus = transaction.status === 'Success' ? 'Confirmed' : order.orderStatus;
        order.paymentReference = referenceNumber || transaction.transactionId;
        order.timeline.push({
            label: 'Payment verification',
            detail: `Gateway returned ${status}.`,
        });
        await order.save();
    }

    return transaction;
};

router.post('/initiate', async (req, res) => {
    try {
        const {
            orderId,
            paymentMethod,
            amount,
            phoneNumber,
            email,
        } = req.body;

        const transactionId = `TXN-${Date.now()}`;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        const merchantAccount = paymentMethod === 'bank_transfer'
            ? merchantAccounts.bankTransfer
            : merchantAccounts[paymentMethod] || {};

        await PaymentTransaction.create({
            orderId,
            paymentMethod,
            amount,
            transactionId,
            referenceNumber: transactionId,
            status: 'Initiated',
            merchantAccount,
            gatewayResponse: { paymentMethod, phoneNumber, email, merchantAccount },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        order.paymentStatus = toStatus(paymentMethod);
        order.paymentReference = transactionId;
        order.timeline.push({
            label: 'Payment initiated',
            detail: `${paymentMethod} initiation started for ${amount} ETB.`,
        });
        await order.save();

        const response = {
            success: true,
            transactionId,
            status: order.paymentStatus,
            merchantAccount,
            message: `${paymentMethod} initialized successfully.`,
        };

        if (paymentMethod === 'telebirr') {
            response.paymentUrl = `${GATEWAY_URLS.telebirr}?txn=${transactionId}&receiver=${encodeURIComponent(merchantAccounts.telebirr.shortCode || 'kaloss')}`;
            response.pushNotificationSent = true;
        }

        if (['chapa', 'cbebirr', 'hellocash'].includes(paymentMethod)) {
            response.checkoutUrl = `${GATEWAY_URLS[paymentMethod]}?txn=${transactionId}&amount=${amount}&merchant=${encodeURIComponent(merchantAccounts[paymentMethod]?.merchantName || 'Kaloss Coffee Trading PLC')}`;
        }

        if (paymentMethod === 'bank_transfer') {
            response.instructions = 'Upload your transfer receipt and enter the bank reference number for manual verification.';
        }

        if (paymentMethod === 'cod') {
            response.instructions = 'Your order has been placed as Awaiting Payment. Cash will be collected on delivery.';
        }

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Payment initiation failed.' });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { transactionId, status, referenceNumber, gatewayResponse } = req.body;
        const transaction = await verifyTransaction({ transactionId, status, referenceNumber, gatewayResponse });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        return res.json({ success: true, transaction });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Payment verification failed.' });
    }
});

router.post('/telebirr/webhook', async (req, res) => {
    try {
        const { transactionId, status, referenceNumber } = req.body;
        const transaction = await verifyTransaction({
            transactionId,
            status,
            referenceNumber,
            gatewayResponse: req.body,
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Telebirr webhook failed.' });
    }
});

router.post('/chapa/webhook', async (req, res) => {
    try {
        const txRef = req.body.tx_ref || req.body.transactionId;
        const transaction = await verifyTransaction({
            transactionId: txRef,
            status: req.body.status,
            referenceNumber: req.body.reference || txRef,
            gatewayResponse: req.body,
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Chapa webhook failed.' });
    }
});

router.post('/bank-transfer/upload', async (req, res) => {
    try {
        const { orderId, receiptUrl, referenceNumber } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        order.paymentReceipt = receiptUrl;
        order.paymentReference = referenceNumber;
        order.paymentStatus = 'Pending Verification';
        order.timeline.push({
            label: 'Receipt uploaded',
            detail: `Receipt submitted with reference ${referenceNumber || 'N/A'}.`,
        });
        await order.save();

        return res.json({ success: true, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Receipt upload failed.' });
    }
});

module.exports = router;
