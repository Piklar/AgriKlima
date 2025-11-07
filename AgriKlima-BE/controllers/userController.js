// backend/controllers/userController.js

const User = require("../models/User");
const Variety = require("../models/Variety");
const Crop = require("../models/Crop");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const cloudinary = require('../config/cloudinary');
const { add } = require('date-fns');

// === [CHECK] CHECK IF EMAIL/MOBILE EXISTS ===
module.exports.checkUserExists = async (req, res) => {
    try {
        const { email, mobileNo } = req.body;

        if (!email && !mobileNo) {
            return res.status(400).send({ error: "Email or mobile number is required for check." });
        }

        const query = email ? { email: email.trim().toLowerCase() } : { mobileNo: mobileNo.trim() };

        const user = await User.findOne(query);

        if (user) {
            return res.status(200).json({ exists: true, message: `${email ? 'Email' : 'Mobile number'} is already in use.` });
        } else {
            return res.status(200).json({ exists: false });
        }

    } catch (error) {
        console.error("Error in checkUserExists:", error);
        res.status(500).send({ error: "Internal server error during check." });
    }
};

// === [CREATE] REGISTER A NEW USER ===
module.exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobileNo, location, userCrops, dob, gender, language } = req.body;

        // --- Basic Validation ---
        if (!firstName || !lastName || !email || !password || !mobileNo) {
            return res.status(400).send({ error: "Missing required account fields." });
        }

        // --- Stricter Password Validation ---
        // Password must be at least 8 characters long, contain one uppercase letter, and one special character.
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ error: "Password must be at least 8 characters long, contain one uppercase letter, and one special character." });
        }
        
        if (mobileNo.length !== 11) {
            return res.status(400).send({ error: "Mobile number must be 11 digits." });
        }

        // --- Check for existing email OR mobile number ---
        const existingUser = await User.findOne({ $or: [{ email: email }, { mobileNo: mobileNo }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).send({ error: "Email is already in use." });
            }
            if (existingUser.mobileNo === mobileNo) {
                return res.status(409).send({ error: "Mobile number is already in use." });
            }
        }
        
        // --- Process User Crops ---
        let processedUserCrops = [];
        if (userCrops && userCrops.length > 0) {
            processedUserCrops = await Promise.all(userCrops.map(async (userCrop) => {
                const masterCrop = await Crop.findById(userCrop.cropId);
                if (!masterCrop || typeof masterCrop.growingDuration !== 'number') {
                    console.warn(`Skipping invalid crop during registration. ID: ${userCrop.cropId}`);
                    return null;
                }
                const plantingDate = new Date(userCrop.plantingDate);
                const estimatedHarvestDate = add(plantingDate, { days: masterCrop.growingDuration });
                return {
                    cropId: masterCrop._id,
                    name: masterCrop.name,
                    plantingDate: plantingDate,
                    estimatedHarvestDate: estimatedHarvestDate,
                    status: 'active' // Ensure initial status is set
                };
            }));
            processedUserCrops = processedUserCrops.filter(crop => crop !== null);
        }

        // --- Create and Save New User ---
        const newUser = new User({
            firstName, lastName, email,
            password: bcrypt.hashSync(password, 10),
            mobileNo, location, dob, gender, language,
            userCrops: processedUserCrops,
            profilePictureUrl: ''
        });

        await newUser.save();
        res.status(201).send({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Error during user registration:", error);
        // This will now also catch the unique index error from the database as a final safety net
        if (error.code === 11000) {
            return res.status(409).send({ error: "Email or Mobile Number is already registered." });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: "Validation failed", details: error.message });
        }
        res.status(500).send({ error: "Internal server error." });
    }
};

// === [AUTHENTICATE] LOG IN A USER ===
module.exports.loginUser = (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).send({ error: "Email/Mobile and password are required." });
    }

    User.findOne({
        $or: [{ email: identifier }, { mobileNo: identifier }]
    }).select('+password')
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found." });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (isPasswordCorrect) {
                return res.status(200).send({ access: auth.createAccessToken(user) });
            } else {
                return res.status(401).send({ error: "Invalid credentials." });
            }
        }).catch(err => {
            console.error("Error during login:", err);
            return res.status(500).send({ error: "Error during login process." });
        });
};

// === [READ] GET PROFILE ===
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

// === [UPDATE] PROFILE PICTURE ===
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

// === [UPDATE] CHANGE PASSWORD ===
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) { return res.status(400).send({ error: "Current and new passwords are required." }); }
        
        // Apply strict validation for change password as well
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({ error: "New password must be at least 8 characters long, contain one uppercase letter, and one special character." });
        }

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

// === [UPDATE] RESET PASSWORD ===
module.exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        // Apply strict validation for reset password as well
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({ error: "New password must be at least 8 characters long, contain one uppercase letter, and one special character." });
        }

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

// === [UPDATE] UPDATE USER PROFILE INFO ===
module.exports.updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.userId;
        if (req.user.id !== userIdToUpdate && !req.user.isAdmin) {
            return res.status(403).send({ error: "Authorization failed. You can only update your own profile." });
        }

        // Filter out fields that shouldn't be updated via this route
        const allowedUpdates = ['firstName', 'lastName', 'email', 'location', 'dob', 'gender', 'language'];
        const fieldsToUpdate = {};
        
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                fieldsToUpdate[key] = req.body[key];
            }
        }
        
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).send({ error: "No valid fields provided for update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userIdToUpdate,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        ).select('-password');

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

// === [ADMIN] GET ALL USERS (with pagination & search) ===
module.exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } } // Include location in search
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

// === [ADMIN] SET USER AS ADMIN ===
module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
        .then(user => res.status(200).send({ message: "User set as admin", user }))
        .catch(err => res.status(500).send({ error: "Failed to set user as admin" }));
};

// === [ADMIN] DELETE USER ===
module.exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.userId)
        .then(() => res.status(200).send({ message: "User deleted successfully" }))
        .catch(err => res.status(500).send({ error: "Failed to delete user" }));
};

// === [USER] ADD USER CROP (NOW ADDS A VARIETY) ===
module.exports.addUserCrop = async (req, res) => {
    try {
        const userId = req.user.id;
        const { varietyId, plantingDate } = req.body; // <-- Changed from cropId to varietyId

        if (!varietyId || !plantingDate) {
            return res.status(400).send({ error: 'Variety ID and planting date are required.' });
        }

        const variety = await Variety.findById(varietyId);
        if (!variety || typeof variety.growingDuration !== 'number') {
            return res.status(404).send({ error: 'Variety not found or is missing a valid growing duration.' });
        }

        const pDate = new Date(plantingDate);
        const harvestDate = add(pDate, { days: variety.growingDuration });

        const newUserCrop = {
            varietyId: variety._id,
            plantingDate: pDate,
            estimatedHarvestDate: harvestDate,
            status: 'active'
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { userCrops: newUserCrop } },
            { new: true }
        ).select('-password');

        res.status(200).send({ message: 'Crop variety added to your farm successfully!', user: updatedUser });

    } catch (error) {
        console.error("Error adding user crop:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

// === [USER] GET USER CROPS (NOW POPULATES VARIETY AND ITS PARENT) ===
module.exports.getUserCrops = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('userCrops')
            .populate({
                path: 'userCrops.varietyId',
                model: 'Variety',
                populate: {
                    path: 'parentCrop',
                    model: 'Crop',
                    select: 'name' // We only need the parent's name
                }
            });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const activeCrops = user.userCrops.filter(crop => crop.status === 'active');
        const harvestedCrops = user.userCrops.filter(crop => crop.status === 'harvested');

        res.status(200).send({ activeCrops, harvestedCrops });
    } catch (error) {
        console.error("Error fetching user crops:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

// === [USER] HARVEST USER CROP (Update Status) ===
module.exports.harvestUserCrop = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userCropId } = req.params;

        // Find the user and update the specific sub-document in the userCrops array
        const result = await User.updateOne(
            { "_id": userId, "userCrops._id": userCropId, "userCrops.status": "active" }, // Only update if status is active
            {
                "$set": {
                    "userCrops.$.status": "harvested",
                    "userCrops.$.harvestDate": new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            // Check if it failed because the user/crop wasn't found (matchedCount=0)
            return res.status(404).send({ error: "Active crop not found for this user." });
        }
        
        if (result.modifiedCount === 0) {
            // This case might happen if matchedCount > 0 but the document wasn't modified (e.g., status was already 'harvested')
            return res.status(400).send({ error: "Crop is already marked as harvested." });
        }

        // Fetch the updated user (optional, but good practice to show the updated data)
        const updatedUser = await User.findById(userId).select('-password');

        res.status(200).send({ message: 'Crop marked as harvested successfully!', user: updatedUser });

    } catch (error) {
        console.error("Error harvesting user crop:", error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};