// [SECTION] Dependencies
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

// Route for user registration (Public)
router.post("/register", userController.registerUser);

// Route for user login (Public)
router.post("/login", userController.loginUser);

// Route to get the logged-in user's profile (Private)
router.get("/details", verify, userController.getProfile);

// Route to reset the logged-in user's password (Private)
router.patch('/resetPassword', verify, userController.resetPassword);

// Route to set a user as an admin by their ID (Admin Only)
router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);

// Route to get all users from the database (Admin Only)
router.get("/all", verify, verifyAdmin, userController.getAllUsers);


// [SECTION] Export the router
module.exports = router;