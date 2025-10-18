import mongoose from "mongoose";
import User from "../models/user.js";
import Review from "../models/review.js";
import originalReviews from "../seed/reviews.js";
import Anime from "../models/anime.js";

async function findAllReviews(req, res) {
    try {
        if (req.query.limit && isNaN(req.query.limit)) {
            throw { message: "Limit provided is not a number" };
        }
        const limit = Number(req.query.limit) || 25;
        const query = {};
        if (req.query.reviewId) {
            query._id = req.query.reviewId;
        }
        const results = await Review.find(query).limit(limit);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Bad request" });
    }
}

async function createReview(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(String(req.body.user_id));
        const animeId = Number(req.body.anime_id);
        // Use promise.all to run both queries at the same time
        const [userDoc, animeDoc] = await Promise.all([User.findById(userId), Anime.findById(animeId)]);
        if (userDoc && animeDoc){
            const reviewDoc = await Review.create({
                anime_id: req.body.anime_id,
                user_id: userId,
                reviewText: req.body.reviewText || "",
                rating: Math.round(req.body.rating)
            });
            res.json(reviewDoc);
        } else if (!userDoc && !animeDoc) {
            res.status(404).json({error: "User and Anime not found"});
        } else if (!userDoc) {
            res.status(404).json({error: "User not found"});
        } else { // Anime doc is null
            res.status(404).json({error: "Anime not found"});
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid body" });
    }
}

async function findReviewById(req, res) {
    try {
        const result = await Review.findById(req.params.id);
        if (!result) {
            res.status(404).json({ error: "Review does not exist" });
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid Review ID" });
    }
}

async function updateReview(req, res) {
    try {
        const result = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json({ error: "Review does not exist" });
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid Review ID or body" });
    }
}

async function deleteReview(req, res) {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ error: "Review does not exist" });
        } else {
            res.status(204).json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid Review ID" });
    }
}

async function resetReviewData(req, res) {
    try {
        const resultDelete = await Review.deleteMany({});
        const resultInsert = await Review.insertMany(originalReviews);
        res.redirect("/reviews");
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ error: e.message });
    }
}

export default {
    findAllReviews,
    createReview,
    findReviewById,
    updateReview,
    deleteReview,
    createReview,
    seed: resetReviewData
}