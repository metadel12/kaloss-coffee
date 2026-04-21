const express = require('express');
const {
    getFarmers,
    getFarmerById,
    getImpact,
    getPress,
    getAwards,
    getRegions,
} = require('../controllers/aboutController');

const router = express.Router();

router.get('/farmers', getFarmers);
router.get('/farmers/:id', getFarmerById);
router.get('/impact', getImpact);
router.get('/press', getPress);
router.get('/awards', getAwards);
router.get('/regions', getRegions);

module.exports = router;
