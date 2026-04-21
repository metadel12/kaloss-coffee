const express = require('express');
const {
    getUsers,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getUserOrders,
    getSessions,
    terminateSession,
    applyReferralCode,
    getLoyalty,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/orders', protect, getUserOrders);
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:id', protect, terminateSession);
router.post('/referral/apply', protect, applyReferralCode);
router.get('/loyalty', protect, getLoyalty);

module.exports = router;
