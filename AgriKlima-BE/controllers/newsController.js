// backend/controllers/newsController.js

const News = require('../models/News');
const cloudinary = require('../config/cloudinary');

// --- THIS IS THE FIX ---
module.exports.addNews = (req, res) => {
    // Destructure the nested summary object and top-level properties from the request body.
    const {
        title,
        author,
        imageUrl,
        content,
        summary
    } = req.body;

    let newArticle = new News({
        title,
        author,
        imageUrl,
        content,
        summary: {
            keyPoints: summary.keyPoints,
            quotes: summary.quotes,
            impact: summary.impact
        }
    });

    newArticle.save()
        .then(article => res.status(201).send(article))
        .catch(err => {
            console.error("Error adding news:", err);
            res.status(500).send({ error: "Failed to add news article", details: err.message });
        });
};

module.exports.updateNewsImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }
        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "agriklima_news",
            public_id: req.params.newsId,
            overwrite: true,
        });
        const updatedNews = await News.findByIdAndUpdate(
            req.params.newsId,
            { $set: { imageUrl: result.secure_url } },
            { new: true }
        );
        if (!updatedNews) {
            return res.status(404).send({ error: 'News article not found' });
        }
        res.status(200).send({ message: 'News image updated successfully.', article: updatedNews });
    } catch (error) {
        console.error('Error updating news image:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports.getAllNews = async (req, res) => {
    try {
        const search = req.query.search || "";
        const query = {
            title: { $regex: search, $options: "i" } // Search by title, case-insensitive
        };

        const articles = await News.find(query).sort({ publicationDate: -1 });
        res.status(200).send(articles);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch news articles", details: err.message });
    }
};

module.exports.getNewsById = (req, res) => {
    News.findById(req.params.newsId)
        .then(article => {
            if (!article) return res.status(404).send({ error: "Article not found" });
            return res.status(200).send(article);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch article", details: err.message }));
};

module.exports.updateNews = (req, res) => {
    News.findByIdAndUpdate(
        req.params.newsId, 
        { ...req.body },
        { new: true }
    )
        .then(updatedArticle => {
            if (!updatedArticle) return res.status(404).send({ error: "Article not found" });
            return res.status(200).send({ message: "Article updated successfully", article: updatedArticle });
        })
        .catch(err => res.status(500).send({ error: "Failed to update article", details: err.message }));
};

module.exports.deleteNews = (req, res) => {
    News.findByIdAndDelete(req.params.newsId)
    .then(news => {
        if (!news) return res.status(404).send({ error: "News not found" });
        return res.status(200).send({ message: "News deleted successfully", news });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete news", details: err.message }));
};