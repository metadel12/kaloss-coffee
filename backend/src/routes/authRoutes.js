const express = require('express');
const {
    registerUser,
    loginUser,
    requestLoginOtp,
    verifyLoginOtp,
    logoutUser,
    refreshAuthToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    verifyPhone,
    enableTwoFactor,
    verifyTwoFactorSetup,
    disableTwoFactor,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/login/otp', asyncHandler(requestLoginOtp));
router.post('/login/verify-otp', asyncHandler(verifyLoginOtp));
router.post('/logout', asyncHandler(logoutUser));
router.post('/refresh-token', asyncHandler(refreshAuthToken));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));
router.post('/verify-email', asyncHandler(verifyEmail));
router.post('/verify-phone', asyncHandler(verifyPhone));
router.post('/2fa/enable', protect, asyncHandler(enableTwoFactor));
router.post('/2fa/verify', protect, asyncHandler(verifyTwoFactorSetup));
router.post('/2fa/disable', protect, asyncHandler(disableTwoFactor));

module.exports = router;
