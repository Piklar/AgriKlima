// backend/routes/pestRoutes.js

const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const pestController = require("../controllers/pestController");

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a new pest (Admin only)
router.post("/add", verify, verifyAdmin, pestController.addPest);

// Get all pests (Public)
router.get("/", pestController.getAllPests);

// Get a single pest by ID (Public)
router.get("/:pestId", pestController.getPestById);

// UPDATE a pest's text information (Admin only)
router.put("/:pestId", verify, verifyAdmin, pestController.updatePest);

// --- NEW ROUTE for uploading a pest image ---
router.patch("/:pestId/upload-image", verify, verifyAdmin, upload.single('image'), pestController.updatePestImage);

// DELETE a pest (Admin only)
router.delete("/:pestId", verify, verifyAdmin, pestController.deletePest);

module.exports = router;