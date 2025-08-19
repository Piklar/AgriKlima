// routes/pestRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const pestController = require("../controllers/pestController");

// Add a new pest (Admin only)
router.post("/", verify, verifyAdmin, pestController.addPest);

// Get all pests (Public)
router.get("/", pestController.getAllPests);

// Get a single pest by ID (Public)
router.get("/:pestId", pestController.getPestById);

// --- UPDATE Pest (Admin only) ---
router.put("/:pestId", verify, verifyAdmin, pestController.updatePest);

// --- DELETE Pest (Admin only) ---
router.delete("/:pestId", verify, verifyAdmin, pestController.deletePest);


module.exports = router;