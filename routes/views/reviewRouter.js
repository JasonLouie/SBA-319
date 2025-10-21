import express from "express";
import reviewController from "../../controllers/views/reviews.js";
import { cleanseReviewBody } from "../../utils/utils.js";
const router = express.Router();

router.route("/")
    .get(reviewController.findAllReviews)
    .post(cleanseReviewBody, reviewController.createReview);

router.get("/create", reviewController.create);
router.get("/seed", reviewController.seed);

router.route("/:id")
    .get(reviewController.findReviewById)
    .patch(cleanseReviewBody, reviewController.updateReview)
    .delete(reviewController.deleteReview);

export default router;

