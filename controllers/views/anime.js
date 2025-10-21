import * as animeService from "../../services/animeService.js";
import { getReviewsByAnimeId } from "../../services/reviewService.js";

// GET /anime (No query strings for now)
async function findAllAnimes(req, res, next) {
    try {
        const animes = await animeService.getAllAnime({});
        res.render("anime/index", {
            pageTitle: "All Anime | AniReview",
            anime: animes
        });
    } catch (err) {
        err.action = "Failed to Get All Anime";
        next(err);
    }
}

// POST /anime with body
async function createNewAnime(req, res, next) {
    try {
        const anime = await animeService.createAnime(req.body);
        res.redirect(`/demo/anime/${anime._id}`);
    } catch (err) {
        err.action = "Failed to Create Anime";
        next(err);
    }
}

// GET /anime/create (Load create page)
async function showCreateAnime(req, res, next) {
    try {
        res.render("anime/create");
    } catch (err) {
        err.action = "Failed to Show Create Anime Page";
        next(err)
    }
}

// GET /anime/:id
async function findAnimeById(req, res, next) {
    try {
        const anime = await animeService.getAnimeById(req.params.id);
        anime.genres = anime.genres.join(", ");
        res.render("doc", {
            pageTitle: `${anime.title} | AniReview`,
            doc: anime,
            docType: "Anime",
            route: "anime",
            keys: ["_id", "title", "status", "genres", "type", "premiered", "episodes", "avg_user_rating"]
        });
    } catch (err) {
        err.action = "Failed to Get Anime";
        next(err);
    }
}

// PATCH /anime/:id
async function updateAnime(req, res, next) {
    try {
        await animeService.modifyAnime(req.params.id, req.body);
        res.redirect(`/demo/anime/${req.params.id}`);
    } catch (err) {
        err.action = "Failed to Update Anime";
        next(err);
    }
}

// DELETE /anime/:id
async function deleteAnime(req, res, next) {
    try {
        await animeService.removeAnime(req.params.id);
        res.redirect("/demo/anime");
    } catch (err) {
        err.action = "Failed to Delete Anime";
        next(err);
    }
}

// GET /anime/:id/reviews (Does not work yet must fix)
// async function findReviewsByAnimeId(req, res, next) {
//     try {
//         const reviews = getAllReviewsWithDetails(req.params.id);
//         res.render("reviews/index", {
//             pageTitle: `Review for ${title} | AniReview`,
//             reviews: reviews,
//         });
//     } catch (err) {
//         err.action = "Failed to Get Reviews for Anime"
//         next(err);
//     }
// }

// GET /anime/seed
async function resetAnimeData(req, res, next) {
    try {
        await animeService.resetAnimes();
        res.redirect("/demo/anime");
    } catch (err) {
        err.action = "Failed to Reset Anime";
        next(err);
    }
}

export default {
    findAllAnimes,
    createAnime: createNewAnime,
    findAnimeById,
    updateAnime,
    deleteAnime,
    seed: resetAnimeData,
    create: showCreateAnime
}