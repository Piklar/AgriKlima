// backend/routes/varietyRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const varietyController = require('../controllers/varietyController');

// Get all varieties for a specific crop (Public)
router.get("/crop/:cropId", varietyController.getVarietiesForCrop);

// Add a new variety (Admin only)
router.post("/add", verify, verifyAdmin, varietyController.addVariety);

// Update a variety (Admin only)
router.put("/:varietyId", verify, verifyAdmin, varietyController.updateVariety);

// Delete a variety (Admin only)
router.delete("/:varietyId", verify, verifyAdmin, varietyController.deleteVariety);

module.exports = router;