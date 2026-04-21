const express = require('express');
const {
    createOrder,
    getOrders,
    getUserOrders,
    getOrderById,
    trackOrder,
    cancelOrder,
    getInvoice,
} = require('../controllers/orderController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/mine', protect, getUserOrders);
router.get('/track/:orderNumber', optionalAuth, trackOrder);
router.get('/:orderId', protect, getOrderById);
router.post('/:orderId/cancel', protect, cancelOrder);
router.get('/:orderId/invoice', protect, getInvoice);

module.exports = router;
