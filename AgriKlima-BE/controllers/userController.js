// backend/controllers/userController.js

const User = require("../models/User");
const Crop = require("../models/Crop");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const cloudinary = require('../config/cloudinary');
const { add } = require('date-fns');

// --- [CREATE] Register a new user ---
module.exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobileNo, location, crops, dob, gender, language } = req.body;
        if (!firstName || !lastName || !email || !password || !mobileNo) {
            return res.status(400).send({ error: "Missing required account fields." });
        }
        if (password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters." });
        }
        if (mobileNo.length !== 11) {
            return res.status(400).send({ error: "Mobile number must be 11 digits." });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ error: "Email is already in use." });
        }
        const newUser = new User({
            firstName, lastName, email,
            password: bcrypt.hashSync(password, 10),
            mobileNo, location, crops, dob, gender, language,
            profilePictureUrl: ''
        });
        await newUser.save();
        res.status(201).send({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during user registration:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: "Validation failed", details: error.message });
        }
        res.status(500).send({ error: "Internal server error." });
    }
};

// --- [AUTHENTICATE] Log in a user ---
module.exports.loginUser = (req, res) => {
    User.findOne({ email: req.body.email }).select('+password')
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: "No Email Found" });
        }
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (isPasswordCorrect) {
            return res.status(200).send({ access: auth.createAccessToken(user) });
        } else {
            return res.status(401).send({ error: "Email and password do not match" });
        }
    }).catch(err => {
        console.error("Error during login:", err);
        return res.status(500).send({ error: "Error during login process" });
    });
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id).select('-password')
        .then(user => {
            if (!user) { return res.status(404).send({ error: 'User not found' }); }
            return res.status(200).send(user);
        })
        .catch(err => {
            console.error("Error in getProfile:", err);
            return res.status(500).send({ error: 'Internal server error while fetching profile.' });
        });
};

// --- [UPDATE] Update user's profile picture ---
module.exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }

        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "agriklima_profiles",
            public_id: req.user.id,
            overwrite: true,
            transformation: [
                { width: 300, height: 300, gravity: "face", crop: "fill" }
            ]
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { profilePictureUrl: result.secure_url } },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'Profile picture updated successfully.', user: updatedUser });

    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

// --- [UPDATE] Change a logged-in user's password ---
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) { return res.status(400).send({ error: "Current and new passwords are required." }); }
        if (newPassword.length < 8) { return res.status(400).send({ error: "New password must be at least 8 characters." }); }
        
        const user = await User.findById(req.user.id).select('+password');
        if (!user) { return res.status(404).send({ error: "User not found." }); }
        
        const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordCorrect) { return res.status(400).send({ error: "Incorrect current password." }); }
        
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        
        res.status(200).send({ message: "Password changed successfully." });
    } catch (error) { 
        console.error("Error changing password:", error); 
        res.status(500).send({ error: "Internal server error." }); 
    }
};

// --- [UPDATE] Reset a user's password ---
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (newPassword.length < 8) { return res.status(400).send({ error: "Password must be at least 8 characters" }); }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) { return res.status(404).send({ error: "User not found." }); }
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.status(200).send({ message: 'Password reset successful' });
  } catch (err) { 
    console.error("Failed to reset password: ", err); 
    res.status(500).send({ error: 'Failed to reset password' }); 
  }
};

// --- [UPDATE] Update a user's profile information ---
module.exports.updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.userId;
        if (req.user.id !== userIdToUpdate && !req.user.isAdmin) {
            return res.status(403).send({ error: "Authorization failed. You can only update your own profile." });
        }

        const { firstName, lastName, email } = req.body;
        const fieldsToUpdate = { firstName, lastName, email };

        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        
        res.status(200).send({ message: 'Profile updated successfully', user: updatedUser });

    } catch (error) { 
        if (error.code === 11000) {
            return res.status(400).send({ error: "Email is already in use." });
        }
        console.error("Error in updateUser:", error); 
        res.status(500).send({ message: 'Internal server error' }); 
    }
};

// === ADMIN-ONLY FUNCTIONS ===
// UPGRADED getAllUsers with search + pagination
module.exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).send({
            users,
            totalPages,
            currentPage: page,
            totalUsers
        });

    } catch (err) {
        console.error("Error in getAllUsers:", err);
        return res.status(500).send({ error: 'Failed to fetch users' });
    }
};

module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
    .then(user => res.status(200).send({ message: "User set as admin", user }))
    .catch(err => res.status(500).send({ error: "Failed to set user as admin" }));
};

module.exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.userId)
    .then(() => res.status(200).send({ message: "User deleted successfully" }))
    .catch(err => res.status(500).send({ error: "Failed to delete user" }));
};

// --- NEW CONTROLLER FUNCTIONS for User's Planted Crops ---
module.exports.addUserCrop = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cropId, plantingDate } = req.body;

        if (!cropId || !plantingDate) {
            return res.status(400).send({ error: 'Crop ID and planting date are required.' });
        }

        const masterCrop = await Crop.findById(cropId);
        if (!masterCrop || typeof masterCrop.growingDuration !== 'number') {
            return res.status(404).send({ error: 'Crop not found or is missing a valid growing duration.' });
        }

        const pDate = new Date(plantingDate);
        const harvestDate = add(pDate, { days: masterCrop.growingDuration });

        const newUserCrop = {
            cropId: masterCrop._id,
            name: masterCrop.name,
            plantingDate: pDate,
            estimatedHarvestDate: harvestDate
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { userCrops: newUserCrop } },
            { new: true }
        ).select('-password');

        res.status(200).send({ message: 'Crop added to your farm successfully!', user: updatedUser });

    } catch (error) {
        console.error("Error adding user crop:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports.getUserCrops = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('userCrops')
            .populate('userCrops.cropId', 'imageUrl');

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(user.userCrops);
    } catch (error) {
        console.error("Error fetching user crops:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports.deleteUserCrop = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userCropId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { userCrops: { _id: userCropId } } },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).send({ error: "User not found." });
        }
        res.status(200).send({ message: 'Crop removed from your farm successfully!', user: updatedUser });

    } catch (error) {
        console.error("Error deleting user crop:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};
