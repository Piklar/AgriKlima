// controllers/weatherController.js
const Weather = require('../models/Weather');

/**
 * [CREATE] Add weather data for a new location (Admin Only).
 * This is for the initial setup. Use the update route for daily changes.
 */
module.exports.addWeatherLocation = (req, res) => {
    Weather.findOne({ location: req.body.location }).then(existing => {
        if (existing) {
            return res.status(409).send({ error: "Weather data for this location already exists." });
        }
        let newWeatherData = new Weather({ ...req.body });
        newWeatherData.save()
            .then(data => res.status(201).send(data))
            .catch(err => res.status(500).send({ error: "Failed to add weather data", details: err.message }));
    })
};

/**
 * [READ] Get weather data by location name (Public).
 */
module.exports.getWeatherByLocation = (req, res) => {
    // URL encode spaces, e.g., "Mexico, Pampanga" becomes "Mexico%2C%20Pampanga"
    const locationName = decodeURIComponent(req.params.location);
    Weather.findOne({ location: locationName })
        .then(data => {
            if (!data) return res.status(404).send({ error: "Weather data not found for this location" });
            return res.status(200).send(data);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch weather data", details: err.message }));
};

/**
 * [UPDATE] Update weather data for a location (Admin Only).
 * uses upsert:true to create a new document if one doesn't exist for the location.
 */
module.exports.updateWeatherByLocation = (req, res) => {
    const locationName = decodeURIComponent(req.params.location);
    const updatedData = { ...req.body, lastUpdated: new Date() }; // Automatically update the timestamp

    Weather.findOneAndUpdate({ location: locationName }, updatedData, { new: true, upsert: true })
        .then(data => res.status(200).send({ message: "Weather data updated successfully", data: data }))
        .catch(err => res.status(500).send({ error: "Failed to update weather data", details: err.message }));
};