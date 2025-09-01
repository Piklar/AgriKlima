// backend/controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const cloudinary = require('../config/cloudinary');

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

// --- [READ] Get user's profile ---
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
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
            transformation: [ { width: 300, height: 300, gravity: "face", crop: "fill" } ]
        });
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { profilePictureUrl: result.secure_url } },
            { new: true }
        );
        if (!updatedUser) { return res.status(404).send({ error: 'User not found' }); }
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
module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(users => { return res.status(200).send({ users: users }); })
    .catch(err => {
        console.error("Error in getAllUsers:", err);
        return res.status(500).send({ error: 'Failed to fetch users' });
    });
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