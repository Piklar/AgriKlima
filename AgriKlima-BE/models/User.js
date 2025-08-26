// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
    // --- MODIFIED LINE ---
    email: { 
        type: String, 
        required: [true, 'Email is Required'],
        unique: true // Ensures no two users can have the same email
    },
    password: { type: String, required: [true, 'Password is Required'] },
    isAdmin: { type: Boolean, default: false },
    mobileNo: { type: String, required: [true, 'Mobile Number is Required'] },
    isActive: { type: Boolean, default: true },
    location: {
        type: String,
        required: [true, 'Location is Required']
    },
    farmerStatus: {
        type: String,
        enum: ['Starting Farmer', 'Long Term Farmer'],
        required: [true, 'Farmer Status is Required']
    },
    crops: [
        { type: String }
    ]
});

module.exports = mongoose.model('User', userSchema);