// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

// CORRECTED: module.exports
module.exports.registerUser = (req,res) => {
	// Basic validation for email, mobile number, and password length
	if (!req.body.email.includes("@")){
		return res.status(400).send({ error: "Email invalid" });
	}
	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({ error: "Mobile number invalid" });
	}
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be at least 8 characters" });
	}
	// If all validation passes, proceed with creating the user
	else {
		// Create a new User object including the new AgriKlima-specific fields
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10),
            // AgriKlima specific fields from the multi-step sign-up form
            location: req.body.location,
            farmerStatus: req.body.farmerStatus,
            crops: req.body.crops
		});
		
		// Save the new user to the database
		newUser.save()
		.then((user) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(err => {
            console.error("Error in saving user: ", err);
            return res.status(500).send({ error: "Error in saving user" });
        });   
	}
};

module.exports.getAllUsers = (req, res) => {
    return User.find({})
        .then(users => {
            if (users.length > 0) {
                // Exclude passwords for all users found
                const usersWithoutPasswords = users.map(user => {
                    user.password = undefined;
                    return user;
                });
                return res.status(200).send({ users: usersWithoutPasswords });
            } else {
                return res.status(404).send({ message: 'No users found' });
            }
        })
        .catch(err => {
            console.error("Failed to fetch all users: ", err);
            return res.status(500).send({ error: 'Failed to fetch users' });
        });
};

/**
 * [AUTHENTICATE] Log in a user.
 * @param {object} req - The request object from the client.
 * @param {object} res - The response object to be sent to the client.
 */
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		User.findOne({ email : req.body.email })
		.then(user => {
			// Check if user exists
			if(user == null){
				return res.status(404).send({ error: "No Email Found" });
			} else {
				// Compare the hashed password from the DB with the plain text password
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
				if (isPasswordCorrect) {
                    // If passwords match, create a JWT access token
					return res.status(200).send({ access : auth.createAccessToken(user) });
				} else {
					return res.status(401).send({ error: "Email and password do not match" });
				}
			}
		})
		.catch(err => {
            console.error("Error in find user during login: ", err);
            return res.status(500).send({ error: "Error during login process" });
        });
	}
	else {
		return res.status(400).send({ error: "Invalid Email" });
	}
};

/**
 * [READ] Get a user's profile details.
 * @param {object} req - The request object, containing the user's decoded token.
 * @param {object} res - The response object to be sent to the client.
 */
module.exports.getProfile = (req, res) => {
	// The `verify` middleware should have attached the decoded token payload to `req.user`.
	// First, let's check if it exists and has an ID.
	if (!req.user || !req.user.id) {
        return res.status(401).send({ error: 'Invalid token or user data missing.' });
    }

    const userId = req.user.id;

    return User.findById(userId)
        .then(user => {
            if (!user) {
                // This can happen if the user was deleted after the token was issued.
            	return res.status(404).send({ error: 'User not found' });
            }
            
            // Exclude sensitive password from the response before sending.
            user.password = undefined;
			return res.status(200).send(user); // Send the user object directly.
        })
        .catch(err => {
            console.error("Error in getProfile findById:", err);
            return res.status(500).send({ error: 'Internal server error while fetching profile.' });
        });
};



/**
 * [UPDATE] Reset a user's password.
 * @param {object} req - The request object, with user ID from token and new password in body.
 * @param {object} res - The response object to be sent to the client.
 */
module.exports.resetPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    // Validate new password length
    if (newPassword.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).send({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Failed to reset password: ", err);
    res.status(500).send({ error: 'Failed to reset password' });
  }
};

/**
 * [UPDATE] Set a user as an administrator (Admin Only).
 * @param {object} req - The request object, with user ID in params.
 * @param {object} res - The response object to be sent to the client.
 */
module.exports.setAsAdmin = (req,res) => {
	return User.findById(req.params.id)
	.then(user => {
		if(user === null){
			return res.status(404).send({ error: "User not Found"});
		} else {
            // Set the isAdmin flag to true
			user.isAdmin = true;
			return user.save()
			.then((updatedUser) => res.status(200).send({ message: "User updated to Admin successfully", user: updatedUser }))
			.catch(err => {
                console.error("Failed to save user as admin: ", err);
                return res.status(500).send({ error: 'Failed in Saving' });
            });
		}
	})
	.catch(err => {
        console.error("Failed to find user for admin update: ", err);
        return res.status(500).send({ error: 'Failed in Find' });
    });
}

// --- UPDATE USER (Users) ---
module.exports.updateUser = (req, res) => {
    // req.user comes from the `verify` middleware
    if (!req.user || !req.user.id) return res.status(401).send({ error: "Unauthorized" });

    // Allow an admin to update any user, or a user to update their own account
    if (!req.user.isAdmin && req.user.id.toString() !== req.params.userId) {
        return res.status(403).send({ error: "Forbidden: You can only update your own account." });
    }
    
    User.findByIdAndUpdate(req.params.userId, { ...req.body }, { new: true, runValidators: true })
        .then(user => {
            if (!user) return res.status(404).send({ error: "User not found" });
            user.password = undefined; // Don't send password back
            return res.status(200).send({ message: "User updated successfully", user });
        })
        .catch(err => res.status(500).send({ error: "Failed to update user", details: err.message }));
};

// --- DELETE USER (Users) ---
module.exports.deleteUser = (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).send({ error: "Unauthorized" });

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