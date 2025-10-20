import * as reviewService from "../../services/reviewService.js";

async function findAllReviews(req, res, next) {
    try {
        const reviews = await reviewService.getAllReviews(req.query);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
}

async function createNewReview(req, res, next) {
    try {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
}

async function findReviewById(req, res, next) {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        res.json(review);
    } catch (err) {
        next(err);
    }
}

async function updateReview(req, res, next) {
    try {
        const updatedReview = await reviewService.modifyReview(req.params.id, reviewBody);
        res.json(updatedReview);
    } catch (err) {
        next(err);
    }
}

async function deleteReview(req, res, next) {
    try {
        const deletedReview = await reviewService.removeReview(req.params.id);
        res.json(deletedReview);
    } catch (err) {
        next(err);
    }
}

async function resetReviewData(req, res, next) {
    try {
        const reviews = await reviewService.resetReviews();
        res.json(reviews);
    } catch (err) {
        next(err);
    }
}

async function findReviewsByType(req, res, next) {
    try {
        const reviews = await reviewService.getReviewsByType(req.params.type, req.query);
        res.json(reviews);
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