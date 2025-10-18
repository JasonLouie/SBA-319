import User from "../models/user.js";
import Review from "../models/review.js";
import originalReviews from "../seed/reviews.js";

async function findAllReviews(req, res) {
    try {
        if (req.query.limit && isNaN(req.query.limit)) {
            throw { message: "Limit provided is not a number" };
        }
        const limit = Number(req.query.limit) || 25;
        const query = {};
        if (req.query.userId) {
            query._id = req.query.userId;
        }
        const results = await Review.find(query).limit(limit);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Bad request"});
    }
}

async function createReview(req, res) {
    try {
        const reviewDoc = await Review.create({
            anime_id: req.body.anime_id,
            user_id: req.body.userId,
            reviewText: req.body.reviewText || "",
            rating: Math.round(req.body.rating)
        });
        res.json(reviewDoc);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid body"});
    }
}

async function findReviewById(req, res) {
    try {
        const result = await Review.findById(req.params.id);
        if (!result) {
            res.status(404).json({error: "Review does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Review ID"});
    }
}

async function updateReview(req, res) {
    try {
        const result = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json({error: "Review does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Review ID or body"});
    }
}

async function deleteReview(req, res) {
    try {
        const result = await Review.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({error: "Review does not exist"});
        } else {
            res.status(204).json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Review ID"});
    }
}

async function resetReviewData(req, res) {
    try {
        const resultDelete = await Review.deleteMany({});
        const resultInsert = await Review.insertMany(originalReviews);
        res.redirect("/reviews");
    } catch (e) {
        console.log(e.message)
        res.status(400).json({error: e.message});
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