const Order = require('../models/Order');
const PaymentTransaction = require('../models/PaymentTransaction');
const mongoose = require('mongoose');
const { merchantAccounts } = require('../config/paymentConfig');

const PAYMENT_LABELS = {
    telebirr: 'Telebirr',
    chapa: 'Chapa',
    cbebirr: 'CBEBirr',
    bank_transfer: 'BankTransfer',
    cod: 'COD',
    hellocash: 'HelloCash',
};

const DELIVERY_DAYS = {
    standard: 4,
    express: 2,
    pickup: 1,
    international: 7,
};

const buildOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const serial = `${Math.floor(Math.random() * 90000) + 10000}`;
    return `KAL-${year}-${serial}`;
};

const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const toObjectIdOrNull = value => {
    if (value && mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    }
    return null;
};

exports.createOrder = async (req, res) => {
    try {
        const {
            customer,
            items,
            summary,
            paymentMethod,
            paymentReference,
            paymentReceipt,
            deliveryOption,
            specialInstructions,
            paymentStatus,
        } = req.body;

        if (!customer?.fullName || !customer?.email || !customer?.phone || !Array.isArray(items) || !items.length) {
            return res.status(400).json({ message: 'Customer details and at least one order item are required.' });
        }

        const orderNumber = buildOrderNumber();
        const normalizedPaymentMethod = PAYMENT_LABELS[paymentMethod] || 'Telebirr';
        const normalizedPaymentStatus = paymentStatus
            || (normalizedPaymentMethod === 'COD' ? 'Awaiting Payment' : normalizedPaymentMethod === 'BankTransfer' ? 'Pending Verification' : 'Processing');
        const normalizedOrderStatus = normalizedPaymentMethod === 'COD' || normalizedPaymentMethod === 'BankTransfer' ? 'Pending' : 'Confirmed';
        const normalizedItems = items.map(item => ({
            productId: toObjectIdOrNull(item.productId),
            catalogProductId: String(item.productId || ''),
            name: item.name,
            variant: item.variant,
            quantity: Number(item.quantity || 0),
            priceETB: Number(item.priceETB || 0),
            subtotal: Number(item.subtotal || 0),
            giftWrap: Boolean(item.giftWrap),
            noteToSeller: item.noteToSeller || '',
        }));
        const normalizedSummary = {
            subtotal: Number(summary?.subtotal || 0),
            shippingFee: Number(summary?.shippingFee || 0),
            giftWrapFee: Number(summary?.giftWrapFee || 0),
            discountAmount: Number(summary?.discountAmount || 0),
            discountCode: summary?.discountCode || '',
            taxAmount: Number(summary?.taxAmount || 0),
            codFee: Number(summary?.codFee || 0),
            totalETB: Number(summary?.totalETB || 0),
            savings: Number(summary?.savings || 0),
        };

        const order = await Order.create({
            orderNumber,
            userId: req.user?._id || null,
            customer,
            items: normalizedItems,
            summary: normalizedSummary,
            paymentMethod: normalizedPaymentMethod,
            paymentStatus: normalizedPaymentStatus,
            paymentReference,
            paymentReceipt,
            orderStatus: normalizedOrderStatus,
            deliveryOption,
            estimatedDelivery: addDays(DELIVERY_DAYS[deliveryOption] || 4),
            specialInstructions,
            timeline: [
                {
                    label: 'Order placed',
                    detail: `${orderNumber} created for ${customer.fullName}.`,
                },
                {
                    label: 'Payment status',
                    detail: normalizedPaymentStatus,
                },
            ],
            notificationLog: {
                confirmationEmailSent: true,
                confirmationSmsSent: true,
                abandonedCartSmsScheduledAt: new Date(Date.now() + (2 * 60 * 60 * 1000)),
                abandonedCartEmailScheduledAt: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            },
            fraudChecks: {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                riskLevel: normalizedSummary.totalETB >= 10000 ? 'medium' : 'low',
                manualReview: normalizedSummary.totalETB >= 15000,
            },
        });

        await PaymentTransaction.create({
            orderId: order._id,
            paymentMethod: normalizedPaymentMethod,
            amount: normalizedSummary.totalETB,
            transactionId: paymentReference || `TX-${Date.now()}`,
            referenceNumber: paymentReference,
            status: normalizedPaymentStatus === 'Paid' ? 'Success' : normalizedPaymentStatus === 'Failed' ? 'Failed' : normalizedPaymentStatus === 'Pending Verification' ? 'Pending Verification' : 'Initiated',
            merchantAccount: normalizedPaymentMethod === 'BankTransfer' ? merchantAccounts.bankTransfer : merchantAccounts[normalizedPaymentMethod.toLowerCase()] || {},
            gatewayResponse: req.body.gatewayResponse || {},
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            verifiedAt: normalizedPaymentStatus === 'Paid' ? new Date() : undefined,
        });

        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to create order.' });
    }
};

exports.getOrders = async (req, res) => {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
};

exports.getUserOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('userId', 'name email');
    if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
    }
    if (!['admin', 'super_admin'].includes(req.user?.role) && String(order.userId?._id || order.userId || '') !== String(req.user?._id || '')) {
        return res.status(403).json({ message: 'You can only view your own orders.' });
    }
    return res.json(order);
};

exports.trackOrder = async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
    }
    return res.json(order);
};

exports.cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
    }
    if (!['admin', 'super_admin'].includes(req.user?.role) && String(order.userId || '') !== String(req.user?._id || '')) {
        return res.status(403).json({ message: 'You can only cancel your own orders.' });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
        return res.status(400).json({ message: 'This order can no longer be cancelled.' });
    }

    order.orderStatus = 'Cancelled';
    order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';
    order.timeline.push({
        label: 'Order cancelled',
        detail: 'Customer requested cancellation before shipment.',
        timestamp: new Date(),
    });
    await order.save();

    return res.json(order);
};

exports.getInvoice = async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
    }
    if (!['admin', 'super_admin'].includes(req.user?.role) && String(order.userId || '') !== String(req.user?._id || '')) {
        return res.status(403).json({ message: 'You can only view your own invoices.' });
    }

    return res.json({
        invoiceNumber: `INV-${order.orderNumber}`,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        summary: order.summary,
        issuedAt: new Date(),
        note: 'PDF generation is scaffolded here; connect Puppeteer or jsPDF in production.',
    });
};
