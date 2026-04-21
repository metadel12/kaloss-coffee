const express = require('express');
const {
    getProducts,
    getRegions,
    getProductById,
    getRelatedProducts,
    getReviewsByProduct,
    createReview,
    createProduct,
    trackProductView,
} = require('../controllers/productController');
const { protect, optionalAuth, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/regions', getRegions);
router.get('/related/:id', optionalAuth, getRelatedProducts);
router.get('/reviews/:productId', getReviewsByProduct);
router.post('/reviews/:productId', createReview);
router.post('/:id/view', trackProductView);
router.get('/:id', optionalAuth, getProductById);
router.post('/', protect, adminOnly, createProduct);

module.exports = router;
