// backend/controllers/varietyController.js

const Variety = require('../models/Variety');
const cloudinary = require('../config/cloudinary'); // Import cloudinary config

// Get all varieties for a specific parent crop
exports.getVarietiesForCrop = async (req, res) => {
    try {
        const varieties = await Variety.find({ parentCrop: req.params.cropId });
        res.status(200).json(varieties);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch varieties", details: error.message });
    }
};

// Add a new variety to a parent crop
exports.addVariety = async (req, res) => {
    try {
        const { name, description, imageUrl, growingDuration, parentCrop } = req.body;
        const newVariety = new Variety({ name, description, imageUrl, growingDuration, parentCrop });
        await newVariety.save();
        res.status(201).json(newVariety);
    } catch (error) {
        res.status(500).json({ error: "Failed to add variety", details: error.message });
    }
};

// Update a variety
exports.updateVariety = async (req, res) => {
    try {
        const updatedVariety = await Variety.findByIdAndUpdate(
            req.params.varietyId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedVariety) return res.status(404).json({ error: "Variety not found" });
        res.status(200).json(updatedVariety);
    } catch (error) {
        res.status(500).json({ error: "Failed to update variety", details: error.message });
    }
};

// Update variety image
exports.updateVarietyImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }
        
        // Convert buffer to base64 URI
        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "agriklima_varieties", // Use a separate folder for varieties
            public_id: req.params.varietyId, // Use variety ID as public_id
            overwrite: true,
        });

        // Update the variety in the database
        const updatedVariety = await Variety.findByIdAndUpdate(
            req.params.varietyId,
            { $set: { imageUrl: result.secure_url } },
            { new: true }
        );

        if (!updatedVariety) {
            return res.status(404).send({ error: 'Variety not found' });
        }
        
        res.status(200).send({ 
          message: 'Variety image updated successfully.', 
          variety: updatedVariety 
        });

    } catch (error) {
        console.error('Error updating variety image:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

// Delete a variety
exports.deleteVariety = async (req, res) => {
    try {
        const deletedVariety = await Variety.findByIdAndDelete(req.params.varietyId);
        if (!deletedVariety) return res.status(404).json({ error: "Variety not found" });
        res.status(200).json({ message: "Variety deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete variety", details: error.message });
    }
};

// Add multiple varieties in bulk
exports.addBulkVarieties = async (req, res) => {
    try {
        const varietiesData = req.body;

        // Check if the body is an array and not empty
        if (!Array.isArray(varietiesData) || varietiesData.length === 0) {
            return res.status(400).send({ error: "Request body must be a non-empty array of varieties." });
        }

        // Insert all varieties at once
        const createdVarieties = await Variety.insertMany(varietiesData);
        
        res.status(201).json(createdVarieties);
    } catch (error) {
        console.error("Error adding bulk varieties:", error);
        res.status(500).json({ error: "Failed to add bulk varieties", details: error.message });
    }
};