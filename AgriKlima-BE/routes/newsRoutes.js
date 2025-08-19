// routes/newsRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const newsController = require("../controllers/newsController");

// Add a new news article (Admin only)
router.post("/", verify, verifyAdmin, newsController.addNews);

// Get all news articles (Public)
router.get("/", newsController.getAllNews);

// Get a single news article (Public)
router.get("/:newsId", newsController.getNewsById);

// Update a news article (Admin only)
router.patch("/:newsId", verify, verifyAdmin, newsController.updateNews);

// --- DELETE News (Admin only) ---
router.delete("/:newsId", verify, verifyAdmin, newsController.deleteNews);

module.exports = router;