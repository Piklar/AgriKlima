// controllers/userController.js

// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

// --- [CREATE] Register a new user ---
module.exports.registerUser = (req,res) => {
	if (!req.body.email.includes("@")){ return res.status(400).send({ error: "Email invalid" }); }
	else if (req.body.mobileNo.length !== 11){ return res.status(400).send({ error: "Mobile number invalid" }); }
	else if (req.body.password.length < 8) { return res.status(400).send({ error: "Password must be at least 8 characters" }); }
	else {
		let newUser = new User({
			firstName : req.body.firstName, lastName : req.body.lastName, email : req.body.email, mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10), location: req.body.location, farmerStatus: req.body.farmerStatus, crops: req.body.crops
		});
		newUser.save().then((user) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(err => { console.error("Error in saving user: ", err); return res.status(500).send({ error: "Error in saving user" }); });   
	}
};
// --- [AUTHENTICATE] Log in a user ---
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		User.findOne({ email : req.body.email }).then(user => {
			if(user == null){ return res.status(404).send({ error: "No Email Found" }); } 
			else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
				if (isPasswordCorrect) { return res.status(200).send({ access : auth.createAccessToken(user) }); } 
				else { return res.status(401).send({ error: "Email and password do not match" }); }
			}
		}).catch(err => { console.error("Error in find user during login: ", err); return res.status(500).send({ error: "Error during login process" }); });
	} else { return res.status(400).send({ error: "Invalid Email" }); }
};
// --- [READ] Get a user's own profile details ---
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id).then(user => {
        if (!user) { return res.status(404).send({ error: 'User not found' }); }
        user.password = undefined; return res.status(200).send(user);
    }).catch(err => { console.error("Error in getProfile findById:", err); return res.status(500).send({ error: 'Internal server error while fetching profile.' }); });
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
        if (error.name === 'ValidationError') return res.status(400).send({ error: "Validation failed", details: error.message });
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

// --- [READ] Get all users (Admin Only) ---
module.exports.getAllUsers = (req, res) => {
    return User.find({})
        .then(users => {
            if (users.length > 0) {
                const usersWithoutPasswords = users.map(user => {
                    user.password = undefined;
                    return user;
                });
                return res.status(200).send({ users: usersWithoutPasswords });
            }
            return res.status(404).send({ message: 'No users found' });
        })
        .catch(err => res.status(500).send({ error: 'Failed to fetch users' }));
};

// --- [UPDATE] Set a user as an administrator (Admin Only) ---
module.exports.setAsAdmin = (req,res) => {
	return User.findById(req.params.id)
	.then(user => {
		if(user === null){
			return res.status(404).send({ error: "User not Found"});
		} else {
			user.isAdmin = true;
			return user.save()
			.then((updatedUser) => res.status(200).send({ message: "User updated to Admin successfully", user: updatedUser }))
			.catch(err => res.status(500).send({ error: 'Failed in Saving' }));
		}
	})
	.catch(err => res.status(500).send({ error: 'Failed in Find' }));
}

// --- [UPDATE] Generic user update for Admins ---
module.exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        if (!updatedUser) return res.status(404).send({ message: 'User not found' });
        updatedUser.password = undefined;
        res.status(200).send({ message: 'User updated successfully by admin', user: updatedUser });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
};

// --- [DELETE] Delete a user ---
module.exports.deleteUser = (req, res) => {
    if (!req.user.isAdmin && req.user.id.toString() !== req.params.userId) {
        return res.status(403).send({ error: "Forbidden: You can only delete your own account." });
    }

    User.findByIdAndDelete(req.params.userId)
        .then(user => {
            if (!user) return res.status(404).send({ error: "User not found" });
            return res.status(200).send({ message: "User deleted successfully" });
        })
        .catch(err => res.status(500).send({ error: "Failed to delete user", details: err.message }));
};