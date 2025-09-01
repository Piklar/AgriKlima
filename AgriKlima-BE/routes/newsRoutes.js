// backend/routes/newsRoutes.js

const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const newsController = require("../controllers/newsController");

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a new news article (Admin only)
router.post("/add", verify, verifyAdmin, newsController.addNews);

// Get all news articles (Public)
router.get("/", newsController.getAllNews);

// Get a single news article (Public)
router.get("/:newsId", newsController.getNewsById);

// Update a news article's text information (Admin only)
router.patch("/:newsId", verify, verifyAdmin, newsController.updateNews);

// --- NEW ROUTE for uploading a news image ---
router.patch("/:newsId/upload-image", verify, verifyAdmin, upload.single('image'), newsController.updateNewsImage);

// DELETE News (Admin only)
router.delete("/:newsId", verify, verifyAdmin, newsController.deleteNews);

module.exports = router;