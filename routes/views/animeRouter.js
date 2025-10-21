import express from "express";
import animeController from "../../controllers/views/anime.js";
import { cleanseAnimeBody } from "../../utils/utils.js";
const router = express.Router();

router.route("/")
    .get(animeController.findAllAnimes)
    .post(cleanseAnimeBody, animeController.createAnime);

router.get("/create", animeController.create);
router.get("/reset", animeController.seed);

// router.get("/popular", animeController.popular);

router.route("/:id")
    .get(animeController.findAnimeById)
    .patch(cleanseAnimeBody, animeController.updateAnime)
    .delete(animeController.deleteAnime);

// router.route("/:id/reviews")
//     .get(animeController.animeReviews)

export default router;