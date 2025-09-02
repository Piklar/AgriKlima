// backend/controllers/pestController.js

const Pest = require('../models/Pest');
const cloudinary = require('../config/cloudinary');

// --- THIS IS THE FIX ---
module.exports.addPest = (req, res) => {
    // Destructure the nested objects and top-level properties from the request body.
    // The incoming JSON should match this structure.
    const { 
        name, 
        type, 
        riskLevel, 
        imageUrl, 
        overview, 
        identification, 
        prevention, 
        treatment 
    } = req.body;

    let newPest = new Pest({
        name,
        type,
        riskLevel,
        imageUrl,
        overview: {
            description: overview.description,
            commonlyAffects: overview.commonlyAffects,
            seasonalActivity: overview.seasonalActivity
        },
        identification: {
            size: identification.size,
            color: identification.color,
            shape: identification.shape,
            behavior: identification.behavior
        },
        prevention: prevention,
        treatment: treatment
    });

    newPest.save()
        .then(pest => res.status(201).send(pest))
        .catch(err => {
            console.error("Error adding pest:", err);
            res.status(500).send({ error: "Failed to add pest", details: err.message });
        });
};

module.exports.updatePestImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }
        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "agriklima_pests",
            public_id: req.params.pestId,
            overwrite: true,
        });
        const updatedPest = await Pest.findByIdAndUpdate(
            req.params.pestId,
            { $set: { imageUrl: result.secure_url } },
            { new: true }
        );
        if (!updatedPest) {
            return res.status(404).send({ error: 'Pest not found' });
        }
        res.status(200).send({ message: 'Pest image updated successfully.', pest: updatedPest });
    } catch (error) {
        console.error('Error updating pest image:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports.getAllPests = (req, res) => {
    Pest.find({})
        .then(pests => res.status(200).send(pests))
        .catch(err => res.status(500).send({ error: "Failed to fetch pests", details: err.message }));
};

module.exports.getPestById = (req, res) => {
    Pest.findById(req.params.pestId)
        .then(pest => {
            if (!pest) return res.status(404).send({ error: "Pest not found" });
            return res.status(200).send(pest);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch pest", details: err.message }));
};

module.exports.updatePest = (req, res) => {
    Pest.findByIdAndUpdate(
        req.params.pestId,
        { ...req.body },
        { new: true, runValidators: true }
    )
    .then(pest => {
        if (!pest) return res.status(404).send({ error: "Pest not found" });
        return res.status(200).send({ message: "Pest updated successfully", pest });
    })
    .catch(err => res.status(500).send({ error: "Failed to update pest", details: err.message }));
};

module.exports.deletePest = (req, res) => {
    Pest.findByIdAndDelete(req.params.pestId)
    .then(pest => {
        if (!pest) return res.status(404).send({ error: "Pest not found" });
        return res.status(200).send({ message: "Pest deleted successfully", pest });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete pest", details: err.message }));
};