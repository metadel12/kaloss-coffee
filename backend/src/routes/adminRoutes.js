const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    approveProduct,
    rejectProduct,
    deleteAdminProduct,
    getPendingProducts,
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrderStatus,
    verifyPayment,
    rejectPayment,
    getPendingPayments,
    getAdminUsers,
    updateUserRole,
    banUser,
    unbanUser,
    deleteUser,
    getAdminLogs,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard/stats', asyncHandler(getDashboardStats));
router.get('/products', asyncHandler(getAdminProducts));
router.post('/products', asyncHandler(createAdminProduct));
router.put('/products/:id', asyncHandler(updateAdminProduct));
router.post('/products/:id/approve', asyncHandler(approveProduct));
router.post('/products/:id/reject', asyncHandler(rejectProduct));
router.delete('/products/:id', asyncHandler(deleteAdminProduct));
router.get('/products/pending', asyncHandler(getPendingProducts));

router.get('/orders', asyncHandler(getAdminOrders));
router.get('/orders/:id', asyncHandler(getAdminOrderById));
router.put('/orders/:id/status', asyncHandler(updateAdminOrderStatus));
router.post('/orders/:id/verify-payment', asyncHandler(verifyPayment));
router.post('/orders/:id/reject-payment', asyncHandler(rejectPayment));
router.get('/payments/pending', asyncHandler(getPendingPayments));

router.get('/users', asyncHandler(getAdminUsers));
router.put('/users/:id/role', asyncHandler(updateUserRole));
router.post('/users/:id/ban', asyncHandler(banUser));
router.post('/users/:id/unban', asyncHandler(unbanUser));
router.delete('/users/:id', asyncHandler(deleteUser));

router.get('/logs', superAdminOnly, asyncHandler(getAdminLogs));

module.exports = router;
