// backend/models/Task.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // --- THIS IS THE FIX ---
    // The assignedTo field is required for the admin panel's populate function to work.
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    dueDate: { type: Date, required: true },

    frequency: {
        type: String,
        enum: ["Once", "Daily", "Weekly", "Monthly"],
        default: "Once"
    },
    recurrenceId: { type: mongoose.Schema.Types.ObjectId } 
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);