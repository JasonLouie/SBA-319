import { getAnimeById } from "../../services/animeService.js";
import * as reviewService from "../../services/reviewService.js";
import { getUserById } from "../../services/userService.js";

// GET /reviews with optional query strings ?reviewId, ?userId, ?animeId, ?limit
async function findAllReviews(req, res, next) {
    try {
        const reviews = await reviewService.getAllReviewsWithDetails();
        res.render("reviews/index", {
            pageTitle: "All Reviews | AniReview",
            reviews: reviews
        });
    } catch (err) {
        err.action = "Failed to Get All Reviews";
        next(err);
    }
}

// POST /reviews with body
async function createNewReview(req, res, next) {
    try {
        const review = await reviewService.createReview(req.body);
        res.redirect(`/demo/anime/${review._id}`);
    } catch (err) {
        err.action = "Failed to Create Review";
        next(err);
    }
}

// GET /reviews/create (Load create page)
async function showCreateReview(req, res, next) {
    try {
        res.render("reviews/create");
    } catch (err) {
        err.action = "Failed to Show Create Review Page";
        next(err)
    }
}

// GET /reviews/:id
async function findReviewById(req, res, next) {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        const [anime, user] = await Promise.all([getAnimeById(review.anime_id), getUserById(review.user_id)]);
        res.render("reviews/doc", {
            pageTitle: `Review for ${anime.title} | AniReview`,
            review: review,
            title: anime.title,
            name: user.name
        });
    } catch (err) {
        next(err);
    }
}

// PATCH /reviews/:id
async function updateReview(req, res, next) {
    try {
        await reviewService.modifyReview(req.params.id, req.body);
        res.redirect(`/demo/reviews/${req.params.id}`);
    } catch (err) {
        err.action = "Failed to Update Review";
        next(err);
    }
}

// DELETE /reviews/:id
async function deleteReview(req, res, next) {
    try {
        await reviewService.removeReview(req.params.id);
        res.redirect("/demo/reviews");
    } catch (err) {
        err.action = "Failed to Delete Review";
        next(err);
    }
}

// GET /reviews/seed
async function resetReviewData(req, res, next) {
    try {
        await reviewService.resetReviews();
        res.redirect("/demo/reviews");
    } catch (err) {
        console.log(err);
        err.action = "Failed to Reset Review";
        next(err);
    }
}

export default {
    findAllReviews,
    createReview: createNewReview,
    findReviewById,
    updateReview,
    deleteReview,
    seed: resetReviewData,
    create: showCreateReview
}