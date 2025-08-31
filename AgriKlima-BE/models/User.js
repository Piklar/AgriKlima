// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // --- Existing Fields ---
    firstName: { type: String, required: [true, 'First Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
    email: { 
        type: String, 
        required: [true, 'Email is Required'],
        unique: true // Prevents duplicate email signups
    },
    password: { type: String, required: [true, 'Password is Required'] },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // --- Fields from your original model ---
    mobileNo: { type: String, required: [true, 'Mobile Number is Required'] },
    location: { type: String, required: [true, 'Location is Required'] },
    crops: [{ type: String }],

    // --- ADDED: New fields from your SignUpPage.jsx ---
    dob: { type: String, required: [true, 'Date of Birth is Required'] },
    gender: { type: String, required: [true, 'Gender is Required'] },
    language: { type: String, default: 'Tagalog' },

    // --- THIS IS THE NEW FIELD FOR THE PROFILE PICTURE ---
    profilePictureUrl: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);