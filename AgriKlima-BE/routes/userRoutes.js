// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

// --- PUBLIC ROUTES (No token needed) ---
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// --- SPECIFIC USER ROUTES (Token needed) ---
// These routes MUST come before any routes with dynamic params like /:userId
router.get("/details", verify, userController.getProfile);
router.put("/update-profile", verify, userController.updateProfile);
router.patch('/reset-password', verify, userController.resetPassword);
router.put("/change-password", verify, userController.changePassword);

// --- ADMIN-ONLY ROUTES ---
router.get("/all", verify, verifyAdmin, userController.getAllUsers);

// --- DYNAMIC ROUTES (Must come LAST) ---
// These routes use a variable ID in the URL.
router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);
router.put("/:userId/update", verify, verifyAdmin, userController.updateUser);
router.delete("/:userId", verify, userController.deleteUser);

module.exports = router;