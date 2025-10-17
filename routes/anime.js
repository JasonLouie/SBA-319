import express from "express";

const router = express.Router();

router.route("/")
    .get()
    .post();

router.route("/:id")
    .get()
    .patch()
    .delete();

router.route("/:id/ratings")
    .get()
    .post();

router.route("/:id/ratings/:rating_id")
    .get()
    .patch()
    .delete();

router.route("/:id/popular")
    .get();

router.route("/:id/popular/genres")
    .get();