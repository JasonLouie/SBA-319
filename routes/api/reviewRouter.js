import express from "express";
import reviewController from "../../controllers/api/reviews.js";
const router = express.Router();

router.route("/")
    .get(reviewController.findAllReviews)
    .post(reviewController.createReview);

router.get("/seed", reviewController.seed);

// Get reviews that are at least 7/10 - positive
// 4/10 to 6/10 - decent
// below 4/10 - negative
router.get("/rating/:type", reviewController.findReviewsByType);

router.route("/:id")
    .get(reviewController.findReviewById)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

export default router;

