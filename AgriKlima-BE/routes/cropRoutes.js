// routes/cropRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const cropController = require('../controllers/cropController');

// Add a new crop (Admin only)
router.post("/add", verify, verifyAdmin, cropController.addCrop);

// Get all crops (Public)
router.get("/", cropController.getAllCrops);

// Get a single crop by ID (Public)
router.get("/:cropId", cropController.getCropById);

module.exports = router;