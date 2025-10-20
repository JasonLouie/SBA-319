import express from "express";
import userController from "../../controllers/api/users.js";

const router = express.Router();

router.route("/")
    .get(userController.findAllUsers)
    .post(userController.createUser);

router.get("/seed", userController.seed);

router.route("/:id")
    .get(userController.findUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.route("/:id/reviews")
    .get(userController.userReviews)
    .post(userController.createReview);

export default router;