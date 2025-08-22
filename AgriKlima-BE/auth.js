// [SECTION] Dependencies
require('dotenv').config(); // Allows us to use the .env file for sensitive information
const jwt = require("jsonwebtoken");

// [SECTION] Secret Keyword
// Use the secret from the .env file, with a fallback for safety
const secret = process.env.JWT_SECRET || "AgriKlimaFallbackSecret";

/**
 * [FUNCTION] Token Creation
 * Creates a JSON Web Token (JWT) access token for an authenticated user.
 * @param {object} user - The user object containing id, email, and isAdmin status.
 * @returns {string} - The generated JWT access token.
 */
module.exports.createAccessToken = (user) => {
	// The data that will be part of the token's payload
const data = {
        _id: user._id, // fixed!
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, {});
};

/**
 * [MIDDLEWARE] Token Verification
 * Verifies the JWT from the request's Authorization header.
 * If the token is valid, it decodes it and attaches the payload to `req.user`.
 * If invalid or missing, it sends an appropriate error response.
 */
module.exports.verify = (req, res, next) => {
	// Get the token from the Authorization header
	let token = req.headers.authorization;

	// Check if a token is provided
	if (typeof token === "undefined") {
		return res.status(401).send({ auth: "Failed. No Token Provided" });
	} else {
		// The token from the header is typically in the format "Bearer <token>"
		// We slice the "Bearer " part off to get the actual token string
		token = token.slice(7, token.length);

		// [SECTION] Token Decryption
		// Use jwt.verify() to check the token's integrity and decode its payload
		jwt.verify(token, secret, function(err, decodedToken) {
			if (err) {
				// If the token is invalid (e.g., expired, tampered with)
				return res.status(401).send({
					auth: "Failed",
					message: err.message
				});
			} else {
				// If the token is valid, attach the decoded payload to the request object
				req.user = decodedToken;
				// Pass control to the next middleware or controller function in the chain
				next();
			}
		});
	}
};

/**
 * [MIDDLEWARE] Admin Verification
 * Checks if the authenticated user is an administrator.
 * This middleware MUST be used after the `verify` middleware.
 */
module.exports.verifyAdmin = (req, res, next) => {
	// The `req.user` object is attached by the `verify` middleware that runs before this one
	if (req.user && req.user.isAdmin) {
		// If the user is an admin, pass control to the next function
		next();
	} else {
		// If the user is not an admin, end the request and send a 'Forbidden' error
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden: User is not an admin"
		});
	}
};
