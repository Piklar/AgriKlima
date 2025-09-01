// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// === PUBLIC ROUTES ===
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// === PRIVATE USER ROUTES ===
router.get("/details", verify, userController.getProfile);
router.patch("/change-password", verify, userController.changePassword);
router.patch("/update-picture", verify, upload.single('profilePicture'), userController.updateProfilePicture);
router.patch('/resetPassword', verify, userController.resetPassword);

// PUT to update the user's main profile info (firstName, lastName, email)
router.put("/:userId", verify, userController.updateUser);


// === ADMIN-ONLY ROUTES ===
router.get("/all", verify, verifyAdmin, userController.getAllUsers);
router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);
router.delete("/:userId", verify, userController.deleteUser);

module.exports = router;