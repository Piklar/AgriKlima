// backend/controllers/varietyController.js

const Variety = require('../models/Variety');

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