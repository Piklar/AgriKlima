// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
    email: { 
        type: String, 
        required: [true, 'Email is Required'],
        unique: true
    },
    password: { 
        type: String, 
        required: [true, 'Password is Required'],
        select: false 
    },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    mobileNo: { type: String, required: [true, 'Mobile Number is Required'] },
    location: { type: String, required: [true, 'Location is Required'] },
    crops: [{ type: String }],
    
    // These fields are NOT required, which prevents validation errors for existing users.
    dob: { type: String },
    gender: { type: String },

    language: { type: String, default: 'English' },
    profilePictureUrl: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);