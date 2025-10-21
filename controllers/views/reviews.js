import * as reviewService from "../../services/reviewService.js";

// GET /reviews with optional query strings ?reviewId, ?userId, ?animeId, ?limit
async function findAllReviews(req, res, next) {
    try {
        const reviews = await reviewService.getAllReviewsWithDetails(req.query);
        let titlePrefix = "All Reviews";
        if (req.query.userId) {
            titlePrefix = `${reviews.length > 0 ? "" : "No "}Reviews by ${reviews.username}`;
        } else if (req.query.animeId) {
            titlePrefix = `${reviews.length > 0 ? "" : "No "}Reviews for ${reviews.animeTitle}`;
        }
        res.render("reviews/index", {
            pageTitle: `${titlePrefix} | AniReview`,
            reviews: reviews
        });
    } catch (err) {
        err.action = "Failed to Get All Reviews";
        next(err);
    }
}

// POST /reviews with body (Not using ids since username and anime title are easier to provide)
async function newReviewByUsernameTitle(req, res, next) {
    try {
        const review = await reviewService.createReviewByUsernameTitle(req.body);
        res.redirect(`/demo/reviews/${review._id}`);
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
        const review = await reviewService.getReviewWithDetailsById(req.params.id);
        review.title = review.anime_id ? review.anime_id.title : "Deleted Anime";
        review.username = review.user_id ? review.user_id.username : "Deleted User";
        res.render("doc", {
            pageTitle: `Review for ${review.title} | AniReview`,
            doc: review,
            docType: "Review",
            route: "reviews",
            keys: ["_id", "title", "username", "rating"]
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
    createReview: newReviewByUsernameTitle,
    findReviewById,
    updateReview,
    deleteReview,
    seed: resetReviewData,
    create: showCreateReview
}