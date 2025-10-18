import express from "express";
import reviewController from "../controllers/reviews.js";
const router = express.Router();

router.route("/")
    .get(reviewController.findAllReviews)
    .post(reviewController.createReview);

router.get("/seed", reviewController.seed);

// Get reviews that are at least 8/10
// router.get("/great");

router.route("/:id")
    .get(reviewController.findReviewById)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

export default router;

