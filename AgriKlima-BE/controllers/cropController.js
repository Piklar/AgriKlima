// controllers/cropController.js

const Crop = require('../models/Crop');

// --- THE FIX IS HERE: `module.exports` ---
module.exports.addCrop = (req, res) => {
    let newCrop = new Crop({ ...req.body });

    newCrop.save()
        .then(crop => res.status(201).send(crop))
        .catch(err => res.status(500).send({ error: "Failed to add crop", details: err.message }));
};

// --- AND HERE ---
module.exports.getAllCrops = (req, res) => {
    Crop.find({})
        .then(crops => res.status(200).send(crops))
        .catch(err => res.status(500).send({ error: "Failed to fetch crops", details: err.message }));
};

// --- AND HERE ---
module.exports.getCropById = (req, res) => {
    Crop.findById(req.params.cropId)
        .then(crop => {
            if (!crop) return res.status(44).send({ error: "Crop not found" });
            return res.status(200).send(crop);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch crop", details: err.message }));
};

// --- UPDATE CROP ---
module.exports.updateCrop = (req, res) => {
    Crop.findByIdAndUpdate(
        req.params.cropId,
        { ...req.body },
        { new: true, runValidators: true }
    )
    .then(crop => {
        if (!crop) return res.status(404).send({ error: "Crop not found" });
        return res.status(200).send(crop);
    })
    .catch(err => res.status(500).send({ error: "Failed to update crop", details: err.message }));
};

// --- DELETE CROP ---
module.exports.deleteCrop = (req, res) => {
    Crop.findByIdAndDelete(req.params.cropId)
    .then(crop => {
        if (!crop) return res.status(404).send({ error: "Crop not found" });
        return res.status(200).send({ message: "Crop deleted successfully", crop });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete crop", details: err.message }));
};