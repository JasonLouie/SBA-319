import express from "express";
import userController from "../../controllers/views/users.js";
import { cleanseUserBody } from "../../utils/utils.js";

const router = express.Router();

router.route("/")
    .get(userController.findAllUsers)
    .post(userController.createUser);

router.get("/create", userController.create)

router.route("/:id")
    .get(userController.findUserById)
    .patch(cleanseUserBody, userController.updateUser)
    .delete(userController.deleteUser);

export default router;