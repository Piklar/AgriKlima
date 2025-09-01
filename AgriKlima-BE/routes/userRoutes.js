// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

// --- Configure Multer for file uploads ---
const multer = require('multer');
// This sets up multer to temporarily store uploaded files in a directory called 'uploads'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for user registration (Public)
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Route to get the logged-in user's profile (Private)
router.get("/details", verify, userController.getProfile);

// Route to reset the logged-in user's password (Private)
router.patch('/resetPassword', verify, userController.resetPassword);

// --- NEW ROUTE for updating the profile picture ---
router.patch("/update-picture", verify, upload.single('profilePicture'), userController.updateProfilePicture);

// --- RENAMED ROUTE for updating general profile info ---
router.put("/update-profile", verify, userController.updateProfile);

// Route to set a user as an admin by their ID (Admin Only)
router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);

// Route to get all users from the database (Admin Only)
router.get("/all", verify, verifyAdmin, userController.getAllUsers);

// Update user (Admin or self)
router.put("/:userId", verify, userController.updateUser);

// Delete user (Admin or self)
router.delete("/:userId", verify, userController.deleteUser);

module.exports = router;