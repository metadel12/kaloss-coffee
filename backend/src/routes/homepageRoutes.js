const express = require('express');
const homepageController = require('../controllers/homepageController');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/homepage', (req, res) => homepageController.getHomepageData(req, res));
router.get('/reviews', (req, res) => homepageController.getReviews(req, res));
router.post('/reviews', rateLimiter, (req, res) => homepageController.createReview(req, res));
router.get('/ceremony-steps', (req, res) => homepageController.getCeremonySteps(req, res));
router.post('/subscribe', rateLimiter, (req, res) => homepageController.subscribeNewsletter(req, res));
router.post('/products/:productId/view', (req, res) => homepageController.incrementProductView(req, res));
router.post('/quiz/submit', rateLimiter, (req, res) => homepageController.submitQuiz(req, res));
router.post('/newsletter/subscribe', rateLimiter, (req, res) => homepageController.subscribeNewsletter(req, res));

module.exports = router;
