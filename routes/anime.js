import express from "express";
import animeController from "../controllers/anime.js";
const router = express.Router();

router.route("/")
    .get(animeController.findAllAnimes)
    .post(animeController.addAnime);

router.get("/seed", animeController.seed);

router.route("/:id")
    .get(animeController.findAnimeById)
    .patch(animeController.updateAnime)
    .delete(animeController.deleteAnime);

router.route("/:id/ratings")
    .get(animeController.animeReviews)
    .post(animeController.createReview);

// router.route("/:id/popular")
//     .get();

// router.route("/:id/popular/genres")
//     .get();

export default router;