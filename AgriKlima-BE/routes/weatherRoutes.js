// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const weatherController = require("../controllers/weatherController");

// Add weather data for a new location (Admin Only)
router.post("/", verify, verifyAdmin, weatherController.addWeatherLocation);

// Get weather data for a specific location (Public)
// Example: GET /weather/Mexico%2C%20Pampanga
router.get("/:location", weatherController.getWeatherByLocation);

// Update weather data for a specific location (Admin Only)
router.patch("/:location", verify, verifyAdmin, weatherController.updateWeatherByLocation);

// --- DELETE Weather (Admin only) ---
router.delete("/:weatherId", verify, verifyAdmin, weatherController.deleteWeather);

module.exports = router;