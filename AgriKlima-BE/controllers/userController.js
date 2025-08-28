// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

// --- [CREATE] Register a new user ---
module.exports.registerUser = async (req, res) => {
    try {
        const { fullName, dob, gender, phone, language, email, password, farmerStatus, crops, location } = req.body;

        if (!fullName || !email || !password || !phone) {
            return res.status(400).send({ error: "Missing required fields." });
        }
        if (password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters." });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ error: "Email is already in use." });
        }

        const locationMap = {
            'Sta Ana': 'Santa Ana, Pampanga', 'Arayat': 'Arayat, Pampanga', 'CSFP': 'San Fernando, Pampanga',
            'Bacolor': 'Bacolor, Pampanga', 'Mexico': 'Mexico, Pampanga'
        };
        const formattedLocation = locationMap[location] || location;

        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts.shift();
        const lastName = nameParts.join(' ');

        const newUser = new User({
            firstName, lastName: lastName || ' ', email,
            password: bcrypt.hashSync(password, 10), mobileNo: phone, location: formattedLocation,
            farmerStatus, crops, dob, gender, language
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
    User.findOne({ email: req.body.email })
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

// --- [READ] Get a user's own profile details ---
// This is the function that fixes your "undefined" problem.
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            user.password = undefined; // Don't send the password back
            return res.status(200).send(user); // Send the full user object
        })
        .catch(err => {
            console.error("Error in getProfile:", err);
            return res.status(500).send({ error: 'Internal server error while fetching profile.' });
        });
};

// --- [UPDATE] Update logged-in user's own profile ---
module.exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if (!firstName || !lastName || !email) { return res.status(400).send({ error: "First name, last name, and email are required." }); }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: { firstName, lastName, email } }, { new: true, runValidators: true });
        if (!updatedUser) { return res.status(404).send({ error: "User not found." }); }
        updatedUser.password = undefined;
        res.status(200).send({ message: "Profile updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) return res.status(400).send({ error: "Email is already in use." });
        res.status(500).send({ error: "Internal server error." });
    }
};

// --- [UPDATE] Change a logged-in user's password ---
module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) { return res.status(400).send({ error: "Current and new passwords are required." }); }
        if (newPassword.length < 8) { return res.status(400).send({ error: "New password must be at least 8 characters." }); }
        const user = await User.findById(req.user.id);
        if (!user) { return res.status(404).send({ error: "User not found." }); }
        const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordCorrect) { return res.status(401).send({ error: "Incorrect current password." }); }
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.status(200).send({ message: "Password changed successfully." });
    } catch (error) { console.error("Error changing password:", error); res.status(500).send({ error: "Internal server error." }); }
};

// --- [UPDATE] Reset a user's password ---
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (newPassword.length < 8) { return res.status(400).send({ error: "Password must be at least 8 characters" }); }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.status(200).send({ message: 'Password reset successful' });
  } catch (err) { console.error("Failed to reset password: ", err); res.status(500).send({ error: 'Failed to reset password' }); }
};


// === ADMIN-ONLY FUNCTIONS ===
module.exports.getAllUsers = (req, res) => {
    User.find({}).then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({ error: 'Failed to fetch users' }));
};
module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
    .then(user => res.status(200).send({ message: "User set as admin", user }))
    .catch(err => res.status(500).send({ error: "Failed to set user as admin" }));
};
module.exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        res.status(200).send({ message: 'User updated successfully by admin', user: updatedUser });
    } catch (error) { res.status(500).send({ message: 'Internal server error' }); }
};
module.exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.userId)
    .then(() => res.status(200).send({ message: "User deleted successfully" }))
    .catch(err => res.status(500).send({ error: "Failed to delete user" }));
};