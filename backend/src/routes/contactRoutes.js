const express = require('express');
const {
    submitContactInquiry,
    getFaqs,
    markFaqHelpful,
    submitWholesaleInquiry,
    submitFarmVisit,
    getCareerOpenings,
    submitJobApplication,
    sendChatMessage,
    getChatMessages,
    newsletterSubscribe,
    getFooterLinks,
    getSocialFollowerCounts,
    getInstagramFeed,
    getWorkingHours,
} = require('../controllers/contactController');

const router = express.Router();

router.post('/contact/submit', submitContactInquiry);
router.post('/contact/wholesale', submitWholesaleInquiry);
router.post('/contact/farm-visit', submitFarmVisit);
router.get('/faqs', getFaqs);
router.post('/faqs/:id/helpful', markFaqHelpful);
router.get('/careers/openings', getCareerOpenings);
router.post('/careers/apply', submitJobApplication);
router.post('/chat/message', sendChatMessage);
router.get('/chat/messages/:sessionId', getChatMessages);
router.post('/newsletter/subscribe', newsletterSubscribe);
router.get('/footer/links', getFooterLinks);
router.get('/social/follower-counts', getSocialFollowerCounts);
router.get('/social/instagram', getInstagramFeed);
router.get('/contact/working-hours', getWorkingHours);

module.exports = router;
