import Anime from "../../models/animeModel.js";
import Review from "../../models/reviewModel.js";
import Counter from "../../models/counterModel.js";
import originalAnimes from "../../seed/anime.js";
import { error, validateLimit } from "../../functions/functions.js";
import { createReview } from "../../services/reviewService.js";

async function findAllAnimes(req, res, next) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.animeId ? await Anime.findById(req.query.animeId) : await Anime.find({}).limit(limit);

        if (req.query.animeId && !results) {
            next(error({ anime: "Anime not found" }, 404));
        } else {
            res.json(results);
        }
    } catch (err) {
        next(err);
    }
}

async function createAnime(req, res, next) {
    try {
        validateAnimeBody(req.body);
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
            next(error({ anime: "Anime not found" }, 404));
        } else {
            res.json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function updateAnime(req, res, next) {
    try {
        validateAnimeBody(req.body);
        const result = await Anime.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        if (!result) {
            next(error({ anime: "Anime not found" }, 404));
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
            next(error({ anime: "Anime not found" }, 404));
        } else {
            res.status(204).json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function findReviewsByAnimeId(req, res, next) {
    try {
        const results = await Review.find({ anime_id: req.params.id });
        res.json(results);
    } catch (err) {
        next(err);
    }
}

async function createNewReview(req, res, next) {
    try {
        req.body.anime_id = req.params.id;
        const review = await createReview(req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
}

async function resetAnimeData(req, res, next) {
    try {
        const resultDelete = await Anime.deleteMany({});
        await Counter.reset(); // Reset the counter to 8 so preceding anime will correctly auto increment
        const resultInsert = await Anime.insertMany(originalAnimes, { new: true });
        res.json(resultInsert);
    } catch (err) {
        next(err);
    }
}

function validateAnimeBody(body) {
    const expectedKeys = ["title", "genres", "status", "type", "premiered", "episodes"];
    const keyErrors = {};

    for (const key in body) {
        if (!expectedKeys.includes(key)) {
            keyErrors[key] = "Invalid key detected";
        } else if (key === "premiered" && typeof body[key] != "number") {
            keyErrors[key] = "Year Premiered must be a number";
        } else if (key === "episodes" && typeof body[key] != "number") {
            keyErrors[key] = "Episodes must be a number";
        }
    }

    if (Object.keys(keyErrors).length > 0) {
        throw error(keyErrors);
    }
}

export default {
    findAllAnimes,
    createAnime,
    findAnimeById,
    updateAnime,
    deleteAnime,
    animeReviews: findReviewsByAnimeId,
    createReview: createNewReview,
    seed: resetAnimeData
}