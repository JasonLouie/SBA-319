import * as animeService from "../../services/animeService.js";
import { createReview, getReviewsByAnimeId } from "../../services/reviewService.js";

// GET /anime with optional query strings ?limit and/or ?animeId
async function findAllAnimes(req, res, next) {
    try {
        const animes = await animeService.getAllAnime(req.query);
        res.json(animes);
    } catch (err) {
        next(err);
    }
}

// POST /anime with body
async function createNewAnime(req, res, next) {
    try {
        const anime = await animeService.createAnime(req.body);
        res.status(201).json(anime);
    } catch (err) {
        next(err);
    }
}

// GET /anime/:id
async function findAnimeById(req, res, next) {
    try {
        const anime = await animeService.getAnimeById(req.params.id);
        res.json(anime);
    } catch (err) {
        next(err);
    }
}

// PATCH /anime/:id
async function updateAnime(req, res, next) {
    try {
        const anime = await animeService.modifyAnime(req.params.id, req.body);
        res.json(anime);
    } catch (err) {
        next(err);
    }
}

// DELETE /anime/:id
async function deleteAnime(req, res, next) {
    try {
        const anime = await animeService.removeAnime(req.params.id);
        res.status(204).json(anime);
    } catch (err) {
        next(err);
    }
}

// GET /anime/:id/reviews
async function findReviewsByAnimeId(req, res, next) {
    try {
        req.body.anime_id = req.body.params.id;
        const reviews = await getReviewsByAnimeId(req.params.id);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
}

// POST /anime/:id/reviews
async function createNewReview(req, res, next) {
    try {
        req.body.anime_id = req.params.id;
        const review = await createReview(req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
}

// GET /anime/seed
async function resetAnimeData(req, res, next) {
    try {
        const results = await animeService.resetAnimes();
        res.json(results);
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
    createReview: createNewReview,
    seed: resetAnimeData
}