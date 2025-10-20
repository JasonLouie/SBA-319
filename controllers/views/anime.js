import * as animeService from "../../services/animeService.js";
import { getReviewsByAnimeId } from "../../services/reviewService.js";

// GET /anime with optional query strings ?limit and/or ?animeId
async function findAllAnimes(req, res, next) {
    try {
        const animes = await animeService.getAllAnime(req.query);
        res.render("anime/index", {
            pageTitle: "All Anime | AniReview",
            anime: animes
        });
    } catch (err) {
        next(err);
    }
}

// POST /anime with body
async function createNewAnime(req, res, next) {
    try {
        const anime = await animeService.createAnime(req.body);
        const msg = {type: "anime", action: req.method, message: "Successfully created anime"};
        res.status(201).render("success", {
            pageTitle: "Anime Creation Success | AniReview",
            doc: anime,
            msg: msg
        });
    } catch (err) {
        next(err);
    }
}

// GET /anime/create (Load create page)
async function showCreateAnime(req, res, next) {
    try {
        res.render("anime/create");
    } catch (err) {
        next(err)
    }
}

// GET /anime/:id
async function findAnimeById(req, res, next) {
    try {
        const anime = await animeService.getAnimeById(req.params.id);
        res.render("anime/doc", {
            pageTitle: `${anime.title} | AniReview`,
            anime: anime
        });
    } catch (err) {
        next(err);
    }
}

// PATCH /anime/:id
async function updateAnime(req, res, next) {
    try {
        const anime = await animeService.modifyAnime(req.params.id, req.body);
        const msg = {type: "anime", action: req.method, message: "Successfully updated anime"};
        res.render("success", {
            pageTitle: "Anime Update Success | AniReview",
            doc: anime,
            msg: msg
        });
    } catch (err) {
        next(err);
    }
}

// DELETE /anime/:id
async function deleteAnime(req, res, next) {
    try {
        const anime = await animeService.removeAnime(req.params.id);
        const msg = {type: "anime", action: req.method, message: `Successfully deleted ${anime.title}`};
        res.render("success", {
            pageTitle: "Anime Deletion Success | AniReview",
            msg: msg
        });
    } catch (err) {
        next(err);
    }
}

// GET /anime/:id/reviews
async function findReviewsByAnimeId(req, res, next) {
    try {
        const reviews = await getReviewsByAnimeId(req.params.id);
        res.render("reviews/index", {
            reviews: reviews
        });
    } catch (err) {
        next(err);
    }
}

// GET /anime/seed
async function resetAnimeData(req, res, next) {
    try {
        const anime = await animeService.resetAnimes();
        res.render("anime/index", {
            anime: anime
        });
    } catch (err) {
        next(err);
    }
}

export default {
    findAllAnimes,
    createAnime: createNewAnime,
    findAnimeById,
    updateAnime,
    deleteAnime,
    animeReviews: findReviewsByAnimeId,
    seed: resetAnimeData,
    create: showCreateAnime
}