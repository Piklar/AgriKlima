// backend/routes/weatherRulesRoutes.js

const express = require('express');
const router = express.Router();
const weatherRulesController = require('../controllers/weatherRulesController');
const { verify, verifyAdmin } = require('../auth');

// Get active rules
router.get('/', weatherRulesController.getActiveRules);

// Update rules (Admin only)
router.put('/', verify, verifyAdmin, weatherRulesController.updateRules);

// Reset to default (Admin only)
router.post('/reset', verify, verifyAdmin, weatherRulesController.resetToDefault);

module.exports = router;
