import express from "express";
import userController from "../../controllers/views/users.js";
import { cleanseModifyUserBody } from "../../utils/utils.js";

const router = express.Router();

router.route("/")
    .get(userController.findAllUsers)
    .post(userController.createUser);

router.get("/create", userController.create)
router.get("/reset", userController.seed);

router.route("/:id")
    .get(userController.findUserById)
    .patch(cleanseModifyUserBody, userController.updateUser)
    .delete(userController.deleteUser);

// router.route("/:id/reviews")
//     .get(userController.userReviews)

export default router;