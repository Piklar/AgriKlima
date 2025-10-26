// backend/controllers/pestController.js

const Pest = require('../models/Pest');
const cloudinary = require('../config/cloudinary');

// Function to add a new pest (Merged to include affectedCrops)
module.exports.addPest = (req, res) => {
    // Destructure the new field: affectedCrops
    const { 
        name, type, riskLevel, imageUrl, 
        overview, identification, prevention, treatment,
        affectedCrops
    } = req.body;

    let newPest = new Pest({
        name, 
        type, 
        riskLevel, 
        imageUrl,
        affectedCrops, // Add it to the new Pest object
        overview: {
            description: overview?.description,
            commonlyAffects: overview?.commonlyAffects,
            seasonalActivity: overview?.seasonalActivity
        },
        identification: {
            size: identification?.size,
            color: identification?.color,
            shape: identification?.shape,
            behavior: identification?.behavior
        },
        prevention: prevention,
        treatment: treatment
    });

    newPest.save()
        .then(pest => res.status(201).send(pest))
        .catch(err => {
            console.error("Error adding pest:", err);
            // Use optional chaining safely in the error details
            res.status(500).send({ error: "Failed to add pest", details: err.message });
        });
};

// Function to update pest image (Unchanged)
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

// Function to get all pests (Merged to include search and populate affectedCrops)
module.exports.getAllPests = async (req, res) => {
    try {
        const search = req.query.search || "";
        const query = { name: { $regex: search, $options: "i" } };

        // Populate affectedCrops, only getting the 'name' field
        const pests = await Pest.find(query).populate('affectedCrops', 'name'); 
        res.status(200).send(pests);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch pests", details: err.message });
    }
};

// Function to get pest by ID (Merged to populate affectedCrops)
module.exports.getPestById = (req, res) => {
    // Populate affectedCrops, getting 'name' and 'imageUrl' for a detailed view
    Pest.findById(req.params.pestId)
        .populate('affectedCrops', 'name imageUrl') 
        .then(pest => {
            if (!pest) return res.status(404).send({ error: "Pest not found" });
            return res.status(200).send(pest);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch pest", details: err.message }));
};

// Function to update a pest (Unchanged, handles affectedCrops via req.body spread)
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

// Function to delete a pest (Unchanged)
module.exports.deletePest = (req, res) => {
    Pest.findByIdAndDelete(req.params.pestId)
    .then(pest => {
        if (!pest) return res.status(404).send({ error: "Pest not found" });
        return res.status(200).send({ message: "Pest deleted successfully", pest });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete pest", details: err.message }));
};