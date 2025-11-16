// backend/routes/varietyRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const varietyController = require('../controllers/varietyController');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Get all varieties for a specific crop (Public)
router.get("/crop/:cropId", varietyController.getVarietiesForCrop);

// Add a new variety (Admin only)
router.post("/add", verify, verifyAdmin, varietyController.addVariety);

// Add multiple varieties in bulk (Admin only)
router.post("/add-bulk", verify, verifyAdmin, varietyController.addBulkVarieties);

// Update a variety (Admin only)
router.put("/:varietyId", verify, verifyAdmin, varietyController.updateVariety);

// Upload a variety image (Admin only)
router.patch(
  "/:varietyId/upload-image", 
  verify, 
  verifyAdmin, 
  upload.single('image'), // Use multer to get a single 'image' file
  varietyController.updateVarietyImage
);

// Delete a variety (Admin only)
router.delete("/:varietyId", verify, verifyAdmin, varietyController.deleteVariety);

module.exports = router;