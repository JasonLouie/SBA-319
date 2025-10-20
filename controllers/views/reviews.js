import Review from "../../models/reviewModel.js";
import originalReviews from "../../seed/reviews.js";
import { error, validateLimit } from "../../functions/functions.js";
import { createReview, findReview, modifyReview, removeReview } from "../../services/reviewService.js";

async function findAllReviews(req, res, next) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.reviewId ? await Review.findById(req.query.reviewId) : await Review.find({}).limit(limit);

        if (req.query.reviewId && !results) {
            next(error({ review: "Review not found" }, 404));
        } else {
            res.json(results);
        }
    } catch (err) {
        next(err);
    }
}

async function createNewReview(req, res, next) {
    try {
        const review = await createReview(req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
}

async function findReviewById(req, res, next) {
    try {
        const review = await findReview(req.params.id);
        res.json(review);
    } catch (err) {
        next(err);
    }
}

async function updateReview(req, res, next) {
    try {
        const updatedReview = await modifyReview(req.params.id, reviewBody);
        res.json(updatedReview);
    } catch (err) {
        next(err);
    }
}

async function deleteReview(req, res, next) {
    try {
        const deletedReview = await removeReview(req.params.id);
        res.json(deletedReview);
    } catch (err) {
        next(err);
    }
}

async function resetReviewData(req, res, next) {
    try {
        const resultDelete = await Review.deleteMany({});
        const resultInsert = await Review.insertMany(originalReviews, {new: true});
        res.json(resultInsert);
    } catch (err) {
        next(err);
    }
}

async function findReviewsByType(req, res, next) {
    try {
        const limit = validateLimit(req.query.limit);
        const query = {};

        switch (req.params.type) {
            case "positive":
                query.rating = { $gte: 7 };
                break;
            case "negative":
                query.rating = { $lt: 4 };
                break;
            case "decent":
                query.rating = { $lte: 6, $gte: 4 };
                break;
            default:
                throw error("Invalid rating type", 400);
        }

        if (req.query.animeId) {
            query.anime_id = Number(req.query.animeId);
        }
        const results = await Review.find(query).limit(limit);
        res.json(results);
    } catch (err) {
        next(err);
    }
}

export default {
    findAllReviews,
    createReview: createNewReview,
    findReviewById,
    updateReview,
    deleteReview,
    findReviewsByType,
    seed: resetReviewData
}