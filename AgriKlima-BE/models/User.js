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
    farmerStatus: {
        type: String,
        // Match the values from your frontend form
        enum: ['Long Term', 'Starting'], 
        required: [true, 'Farmer Status is Required']
    },
    crops: [{ type: String }],
    
    // --- THIS IS THE CRITICAL FIX ---
    // We are REMOVING the `required` constraint from these two fields.
    // This allows existing users without this data to be saved successfully.
    dob: { type: String },
    gender: { type: String },

<<<<<<< Updated upstream
    // --- ADDED: New fields from your SignUpPage.jsx ---
    dob: { type: String, required: [true, 'Date of Birth is Required'] },
    gender: { type: String, required: [true, 'Gender is Required'] },
    language: { type: String, default: 'Tagalog' }
=======
    language: { type: String, default: 'English' },
    profilePictureUrl: { type: String, default: '' }
>>>>>>> Stashed changes
});

module.exports = mongoose.model('User', userSchema);