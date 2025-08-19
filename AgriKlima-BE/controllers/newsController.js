// controllers/newsController.js
const News = require('../models/News');

/**
 * [CREATE] Add a new news article to the database (Admin Only).
 */
module.exports.addNews = (req, res) => {
    let newArticle = new News({ ...req.body });
    newArticle.save()
        .then(article => res.status(201).send(article))
        .catch(err => res.status(500).send({ error: "Failed to add news article", details: err.message }));
};

/**
 * [READ] Get all news articles, sorted by newest first (Public).
 */
module.exports.getAllNews = (req, res) => {
    News.find({}).sort({ publicationDate: -1 }) // -1 means descending order
        .then(articles => res.status(200).send(articles))
        .catch(err => res.status(500).send({ error: "Failed to fetch news articles", details: err.message }));
};

/**
 * [READ] Get a single news article by its ID (Public).
 */
module.exports.getNewsById = (req, res) => {
    News.findById(req.params.newsId)
        .then(article => {
            if (!article) return res.status(404).send({ error: "Article not found" });
            return res.status(200).send(article);
        })
        .catch(err => res.status(500).send({ error: "Failed to fetch article", details: err.message }));
};

/**
 * [UPDATE] Update a news article by its ID (Admin Only).
 */
module.exports.updateNews = (req, res) => {
    News.findByIdAndUpdate(req.params.newsId, { ...req.body }, { new: true })
        .then(updatedArticle => {
            if (!updatedArticle) return res.status(404).send({ error: "Article not found" });
            return res.status(200).send({ message: "Article updated successfully", article: updatedArticle });
        })
        .catch(err => res.status(500).send({ error: "Failed to update article", details: err.message }));
};


// --- DELETE NEWS ---
module.exports.deleteNews = (req, res) => {
    News.findByIdAndDelete(req.params.newsId)
    .then(news => {
        if (!news) return res.status(404).send({ error: "News not found" });
        return res.status(200).send({ message: "News deleted successfully", news });
    })
    .catch(err => res.status(500).send({ error: "Failed to delete news", details: err.message }));
};