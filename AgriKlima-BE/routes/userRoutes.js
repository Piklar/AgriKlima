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
router.post("/check-exists", userController.checkUserExists);

// --- Private User Routes ---
router.get("/details", verify, userController.getProfile);
router.patch("/change-password", verify, userController.changePassword);
router.patch("/update-picture", verify, upload.single('profilePicture'), userController.updateProfilePicture);
router.patch("/resetPassword", verify, userController.resetPassword);
router.put("/:userId", verify, userController.updateUser);

// --- USER CROP MANAGEMENT ROUTES ---
router.post("/my-crops", verify, userController.addUserCrop);
router.get("/my-crops", verify, userController.getUserCrops);
router.delete("/my-crops/:userCropId", verify, userController.deleteUserCrop);

// --- ADMIN-ONLY ROUTES ---
// updated to handle query params (search, page, limit)
router.get("/all", verify, verifyAdmin, userController.getAllUsers);

// --- DYNAMIC ROUTES ---
router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);
router.put("/:userId/update", verify, verifyAdmin, userController.updateUser);
router.delete("/:userId", verify, userController.deleteUser);

module.exports = router;
