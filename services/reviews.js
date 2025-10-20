import User from "../models/user.js";
import Anime from "../models/anime.js";
import Review from "../models/review.js";

export async function createReview(reviewBody) {
    // Validate body first
    validateReviewBody(reviewBody);

    // Use promise.all to run all three queries at the same time
    // Check if anime and user exist (first 2 queries), check if review already exists (3rd query)
    const [userDoc, animeDoc, reviewDoc] = await Promise.all([User.findById(reviewBody.user_id), Anime.findById(reviewBody.anime_id), Review.findOne({ anime_id: reviewBody.anime_id, user_id: reviewBody.user_id })]);

    // Error handling
    if (reviewDoc) {
        throw error("Review already exists", 409);
    } else if (!userDoc && !animeDoc) {
        throw error("User and Anime not found", 404);
    } else if (!userDoc) {
        throw error("User not found", 404);
    } else if (!animeDoc) {
        throw error("Anime not found", 404);
    }

    // Create the review
    const review = await Review.create({
        anime_id: reviewBody.anime_id,
        user_id: reviewBody.user_id,
        comment: reviewBody.comment,
        rating: reviewBody.rating
    });
    return review;
}

export async function findReview(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw error({ review: "Review not found" }, 404);
    }
    return review;
}

export async function findAnimeReviews(animeId) {
    const reviews = await Review.find({ anime_id: animeId });
    return reviews;
}

export async function findUserReviews(userId) {
    const reviews = await Review.find({ user_id: userId });
    return reviews;
}

export async function modifyReview(reviewId, reviewBody) {
    // Validate body first
    validateReviewBody(req.body, false);
    const review = await Review.findByIdAndUpdate(reviewId, reviewBody, { runValidators: true, new: true });
    if (!review) {
        throw error({ review: "Review not found" }, 404);
    }
    return review;
}

export async function removeReview(reviewId) {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        throw error({ review: "Review not found" }, 404);
    }
    return review;
}

function validateReviewBody(body, create = true) {
    const expectedKeys = create ? ["anime_id", "user_id", "rating"] : ["rating"];
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
        throw error(keyErrors);
    }
}