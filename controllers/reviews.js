import mongoose from "mongoose";
import User from "../models/user.js";
import Review from "../models/review.js";
import originalReviews from "../seed/reviews.js";
import Anime from "../models/anime.js";
import { error, formatError, validateLimit } from "../functions/functions.js";

async function findAllReviews(req, res) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.reviewId ? await Review.findById(req.query.reviewId) : await Review.find({}).limit(limit);

        if (req.query.reviewId && !results) {
            res.status(404).json(error("Review not found"));
        } else {
            res.json(results);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function createReview(req, res) {
    try {
        // Validate body first
        validateReviewBody(req.body);
        
        // Use promise.all to run all three queries at the same time
        // Check if anime and user exist (first 2 queries), check if review already exists (3rd query)
        const [userDoc, animeDoc, reviewDoc] = await Promise.all([User.findById(req.body.user_id), Anime.findById(req.body.anime_id), Review.findOne({anime_id: req.body.anime_id, user_id: req.body.user_id})]);
        
        if (userDoc && animeDoc && !reviewDoc) {
            const newReview = await Review.create({
                anime_id: req.body.anime_id,
                user_id: req.body.user_id,
                comment: req.body.comment,
                rating: req.body.rating
            });
            res.status(201).json(newReview);
        } else if (reviewDoc) {
            res.status(409).json(error("Review already exists"))
        } else if (!userDoc && !animeDoc) {
            res.status(404).json(error("User and Anime not found"));
        } else if (!userDoc) {
            res.status(404).json(error("User not found"));
        } else if (!animeDoc){ // Anime doc is null
            res.status(404).json(error("Anime not found"));
        } else {
            res.status(500).json(error("Unexpected error when creating review"));
        }
    } catch (err) {
        console.log(err.message || err);
        res.status(400).json(formatError(err));
    }
}

async function findReviewById(req, res) {
    try {
        const result = await Review.findById(req.params.id);
        if (!result) {
            res.status(404).json(error("Review not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function updateReview(req, res) {
    try {
        const result = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json(error("Review not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function deleteReview(req, res) {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json(error("Review not found"));
        } else {
            res.status(204).json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function resetReviewData(req, res) {
    try {
        const resultDelete = await Review.deleteMany({});
        const resultInsert = await Review.insertMany(originalReviews);
        res.redirect("/reviews");
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function findReviewsByType(req, res) {
    try {
        const limit = validateLimit(req.query.limit);
        const query = {};

        switch (req.params.type) {
            case "positive":
                query.rating = {$gte: 7};
                break;
            case "negative":
                query.rating = {$lt: 4};
                break;
            case "decent":
                query.rating = {$lte: 6, $gte: 4};
                break;
            default:
                throw error("Invalid rating type");
        }

        if (req.query.animeId) {
            query.anime_id = Number(req.query.animeId);
        }
        const results = await Review.find(query).limit(limit);
        res.json(results);
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

export function validateReviewBody(body, type="new") {
    const expectedKeys = type === "new" ? ["anime_id", "user_id", "rating"] : ["rating"];
    const optionalKeys = ["comment"];
    const keyErrors = {};
    
    for (const key in body) {
        if (!expectedKeys.includes(key) && (optionalKeys.length > 0 && !optionalKeys.includes(key))) {
            keyErrors[key] = "Invalid key detected";
        } else if (key === "anime_id" && typeof body[key] != "number") {
            keyErrors[key] = "Anime Id must be a number";
        } else if (key === "rating" && typeof body[key] != "number") {
            keyErrors[key] = "Rating must be a number";
        }
    }

    if (Object.keys(keyErrors).length > 0) {
        throw {errors: keyErrors};
    }
}

export default {
    findAllReviews,
    createReview,
    findReviewById,
    updateReview,
    deleteReview,
    createReview,
    findReviewsByType,
    seed: resetReviewData
}