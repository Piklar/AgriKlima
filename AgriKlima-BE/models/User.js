// backend/models/User.js

const mongoose = require('mongoose');

// --- NEW Sub-schema for user's planted crops ---
const userCropSchema = new mongoose.Schema({
    // We use an ObjectId from the main Crop collection for reference
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    name: { type: String, required: true },
    plantingDate: { type: Date, required: true },
    estimatedHarvestDate: { type: Date, required: true }
});


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
    email: { 
        type: String, 
        required: [true, 'Email is Required'],
        unique: true
    },
    password: { type: String, required: [true, 'Password is Required'] },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    mobileNo: { type: String, required: [true, 'Mobile Number is Required'] },
    location: { type: String, required: [true, 'Location is Required'] },
    dob: { type: String, required: [true, 'Date of Birth is Required'] },
    gender: { type: String, required: [true, 'Gender is Required'] },
    language: { type: String, default: 'Tagalog' },
    profilePictureUrl: { type: String, default: '' },
    
    // --- THIS FIELD IS REPLACED ---
    crops: [{ type: String }], // This can be kept for initial signup info if desired

    // --- THIS IS THE NEW, DYNAMIC FIELD for tracking planted crops ---
    userCrops: [userCropSchema]
});

module.exports = mongoose.model('User', userSchema);