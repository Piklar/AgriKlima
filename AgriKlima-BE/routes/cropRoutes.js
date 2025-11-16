// backend/routes/cropRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const cropController = require('../controllers/cropController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a new crop (Admin only)
router.post("/add", verify, verifyAdmin, cropController.addCrop);

// Add multiple new crops in bulk (Admin only)
router.post("/add-bulk", verify, verifyAdmin, cropController.addBulkCrops);

// ✅ Get all crops (Public, supports query params for search/pagination)
router.get("/", cropController.getAllCrops);

// Get a single crop by ID (Public)
router.get("/:cropId", cropController.getCropById);

// UPDATE a crop's text information (Admin only)
router.put("/:cropId", verify, verifyAdmin, cropController.updateCrop);

// Upload a crop image (Admin only)
router.patch("/:cropId/upload-image", verify, verifyAdmin, upload.single('image'), cropController.updateCropImage);

// DELETE a crop (Admin only)
router.delete("/:cropId", verify, verifyAdmin, cropController.deleteCrop);

module.exports = router;
