// backend/controllers/cropController.js

const Crop = require('../models/Crop');
const cloudinary = require('../config/cloudinary');

// --- THIS IS THE FIX ---
module.exports.addCrop = (req, res) => {
    // req.body arrives as a flat object, e.g. { name: 'Corn', 'overview.plantingSeason': 'Summer' }
    const body = req.body;

    const newCrop = new Crop({
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        season: body.season,
        overview: {
            plantingSeason: body['overview.plantingSeason'],
            harvestTime: body['overview.harvestTime']
        },
        growingGuide: {
            climate: body['growingGuide.climate'],
            soilType: body['growingGuide.soilType'],
            waterNeeds: body['growingGuide.waterNeeds'],
            fertilizer: body['growingGuide.fertilizer']
        },
        healthCare: {
            commonDiseases: body['healthCare.commonDiseases'],
            pestControl: body['healthCare.pestControl'],
            nutritionalValue: body['healthCare.nutritionalValue']
        },
        marketInfo: {
            priceRange: body['marketInfo.priceRange'],
            storageMethod: body['marketInfo.storageMethod'],
            cookingTips: body['marketInfo.cookingTips']
        }
    });

    newCrop.save()
        .then(crop => res.status(201).send(crop))
        .catch(err => {
            console.error("Error adding crop:", err);
            res.status(500).send({ error: "Failed to add crop", details: err.message });
        });
};

module.exports.updateCropImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }
        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "agriklima_crops",
            public_id: req.params.cropId,
            overwrite: true,
        });
        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.cropId,
            { $set: { imageUrl: result.secure_url } },
            { new: true }
        );
        if (!updatedCrop) {
            return res.status(404).send({ error: 'Crop not found' });
        }
        res.status(200).send({ message: 'Crop image updated successfully.', crop: updatedCrop });
    } catch (error) {
        console.error('Error updating crop image:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports.getAllCrops = (req, res) => {
    Crop.find({})
        .then(crops => res.status(200).send(crops))
        .catch(err => res.status(500).send({ error: "Failed to fetch crops", details: err.message }));
};
module.exports.getCropById = (req, res) => {
    Crop.findById(req.params.cropId)
        .then(crop => {
            if (!crop) return res.status(404).send({ error: "Crop not found" });
            return res.status(200).send(crop);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch crop", details: err.message }));
};
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
module.exports.deleteCrop = (req, res) => {
    Crop.findByIdAndDelete(req.params.cropId)
    .then(crop => {
        if (!crop) return res.status(404).send({ error: "Crop not found" });
        return res.status(200).send({ message: "Crop deleted successfully", crop });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete crop", details: err.message }));
};