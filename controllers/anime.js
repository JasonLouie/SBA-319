import Anime from "../models/anime.js";
import Review from "../models/review.js";
import Counter from "../models/counter.js";
import originalAnimes from "../seed/anime.js";
import { error, validateLimit } from "../functions/functions.js";

async function findAllAnimes(req, res, next) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.animeId ? await Anime.findById(req.query.animeId) : await Anime.find({}).limit(limit);

        if (req.query.animeId && !results) {
            res.status(404).json(error("Anime not found"));
        } else {
            res.json(results);
        }
    } catch (err) {
        next(err);
    }
}

async function createAnime(req, res, next) {
    try {
        const animeDoc = await Anime.create({
            title: req.body.title,
            genres: req.body.genres,
            status: req.body.status,
            type: req.body.type,
            premiered: req.body.premiered,
            episodes: req.body.episodes
        });
        res.json(animeDoc);
    } catch (err) {
        next(err);
    }
}

async function findAnimeById(req, res, next) {
    try {
        const result = await Anime.findById(req.params.id);
        if (!result) {
            res.status(404).json(error("Anime not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function updateAnime(req, res, next) {
    try {
        const result = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json(error("Anime not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function deleteAnime(req, res, next) {
    try {
        const result = await Anime.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json(error("Anime not found"));
        } else {
            res.status(204).json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function findReviewsByAnimeId(req, res, next) {
    try {
        const results = await Review.find({anime_id: req.params.id});
        res.json(results);
    } catch (err) {
        next(err);
    }
}

async function createReview(req, res, next) {
    try {
        req.body.anime_id = req.params.id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (err) {
        next(err);
    }
}

async function resetAnimeData(req, res, next) {
    try {
        const resultDelete = await Anime.deleteMany({});
        await Counter.reset(); // Reset the counter to 8 so preceding anime will correctly auto increment
        const resultInsert = await Anime.insertMany(originalAnimes);
        // console.log({...resultDelete, ...resultInsert});
        res.redirect("/anime");
    } catch (err) {
        next(err);
    }
}

export default {
    findAllAnimes,
    createAnime,
    findAnimeById,
    updateAnime,
    deleteAnime,
    animeReviews: findReviewsByAnimeId,
    createReview,
    seed: resetAnimeData
}