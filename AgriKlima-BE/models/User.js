// backend/models/User.js

const mongoose = require('mongoose');

const userCropSchema = new mongoose.Schema({
    // --- THIS IS THE FIX: We now reference a 'Variety' instead of a 'Crop' ---
    varietyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variety', required: true },
    plantingDate: { type: Date, required: true },
    estimatedHarvestDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'harvested'], default: 'active' },
    harvestDate: { type: Date, default: null }
});

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First Name is Required'] },
    lastName: { type: String, required: [true, 'Last Name is Required'] },
    email: { 
        type: String, 
        required: [true, 'Email is Required'],
        unique: true 
    },
    password: { type: String, required: [true, 'Password is Required'], select: false },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    mobileNo: { 
        type: String, 
        required: [true, 'Mobile Number is Required'],
        unique: true
    },
    location: { type: String, required: [true, 'Location is Required'] },
    dob: { type: String, required: [true, 'Date of Birth is Required'] },
    gender: { type: String, required: [true, 'Gender is Required'] },
    language: { type: String, default: 'Filipino' },
    profilePictureUrl: { type: String, default: '' },   
    userCrops: [userCropSchema] // This now uses the updated schema above
});

module.exports = mongoose.model('User', userSchema);