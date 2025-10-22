import express from "express";
import animeController from "../../controllers/api/anime.js";
const router = express.Router();

router.route("/")
    .get(animeController.findAllAnimes)
    .post(animeController.createAnime);

// router.get("/popular", animeController.popular);

router.route("/:id")
    .get(animeController.findAnimeById)
    .patch(animeController.updateAnime)
    .delete(animeController.deleteAnime);

router.route("/:id/reviews")
    .get(animeController.animeReviews)
    .post(animeController.createReview);

export default router;