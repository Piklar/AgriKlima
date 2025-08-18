// controllers/pestController.js
const Pest = require('../models/Pest');

/**
 * [CREATE] Add a new pest entry to the database (Admin Only).
 */
module.exports.addPest = (req, res) => {
    let newPest = new Pest({ ...req.body });

    newPest.save()
        .then(pest => res.status(201).send(pest))
        .catch(err => res.status(500).send({ error: "Failed to add pest", details: err.message }));
};

/**
 * [READ] Get all pest entries from the database (Public).
 */
module.exports.getAllPests = (req, res) => {
    Pest.find({})
        .then(pests => res.status(200).send(pests))
        .catch(err => res.status(500).send({ error: "Failed to fetch pests", details: err.message }));
};

/**
 * [READ] Get a single pest by its ID (Public).
 */
module.exports.getPestById = (req, res) => {
    Pest.findById(req.params.pestId)
        .then(pest => {
            if (!pest) return res.status(404).send({ error: "Pest not found" });
            return res.status(200).send(pest);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch pest", details: err.message }));
};