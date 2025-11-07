// index.js

require('dotenv').config(); // Use dotenv to manage environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const vercelFrontendURL = "https://agri-klima.vercel.app/";

// Import all route files
const userRoutes = require("./routes/userRoutes");
const cropRoutes = require("./routes/cropRoutes");
const pestRoutes = require("./routes/pestRoutes");
const newsRoutes = require("./routes/newsRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const weatherRulesRoutes = require('./routes/weatherRulesRoutes');
const taskRoutes = require("./routes/taskRoutes");
const varietyRoutes = require("./routes/varietyRoutes");

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Database connection
mongoose.connect(MONGODB_URI);
mongoose.connection.once('open', () => console.log('Successfully connected to MongoDB.'));

// Server setup
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect all routes   
app.use("/users", userRoutes);
app.use("/crops", cropRoutes);
app.use("/pests", pestRoutes);
app.use("/news", newsRoutes);
app.use("/weather", weatherRoutes);
app.use("/tasks", taskRoutes); 
app.use("/varieties", varietyRoutes);
app.use('/weather-rules', weatherRulesRoutes);

app.use(cors({
  origin: [vercelFrontendURL, "http://localhost:5173"] // Allow both deployed and local frontends
}));

app.listen(PORT, () => {
    console.log(`API is now online on port ${PORT}`);
});

module.exports = { app, mongoose };