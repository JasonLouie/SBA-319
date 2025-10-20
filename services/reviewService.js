import User from "../models/userModel.js";
import Anime from "../models/animeModel.js";
import Review from "../models/reviewModel.js";
import originalReviews from "../seed/reviews.js";
import { error, validateLimit } from "../functions/functions.js";

export async function getAllReviews(queryString) {
    if (queryString.reviewId) {
        const review = getReviewById(queryString.reviewId);
        return review;
    }
    const limit = validateLimit(queryString.limit);
    const query = {};

    if (queryString.userId) {
        query.user_id = queryString.userId;
    }

    if (queryString.animeId) {
        query.anime_id = queryString.animeId;
    }

    const reviews = await Review.find(query).limit(limit);
    return reviews;
}

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

export async function getReviewById(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw error({ review: "Review not found" }, 404);
    }
    return review;
}

export async function getReviewsByAnimeId(animeId, queryString) {
    const limit = validateLimit(queryString.limit);
    const reviews = await Review.find({ anime_id: animeId }).limit(limit);
    return reviews;
}

export async function getReviewsByUserId(userId, queryString) {
    const limit = validateLimit(queryString.limit);
    const reviews = await Review.find({ user_id: userId }).limit(limit);
    return reviews;
}

export async function modifyReview(reviewId, reviewBody) {
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

export async function resetReviews() {
    await Review.deleteMany({});
    const resultInsert = await Review.insertMany(originalReviews);
    return resultInsert;
}

export async function getReviewsByType(type, queryString) {
    const limit = validateLimit(queryString.limit);
    const query = {};

    switch (type) {
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

    if (queryString.userId) {
        query.user_id = queryString.userId;
    }

    if (queryString.animeId) {
        query.anime_id = Number(queryString.animeId);
    }
    
    const reviews = await Review.find(query).limit(limit);
    return reviews;
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