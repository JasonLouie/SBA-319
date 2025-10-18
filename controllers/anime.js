import Anime from "../models/anime.js";
import Review from "../models/review.js";
import Counter from "../models/counter.js";
import originalAnimes from "../seed/anime.js";

async function findAllAnimes(req, res) {
    try {
        if (req.query.limit && isNaN(req.query.limit)) {
            throw { message: "Limit provided is not a number" };
        }
        const limit = Number(req.query.limit) || 25;
        const query = {};
        if (req.query.animeId) {
            query._id = req.query.animeId;
        }
        const results = await Anime.find(query).limit(limit);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Bad request"});
    }
}

async function createAnime(req, res) {
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
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid body", reason: e.message});
    }
}

async function findAnimeById(req, res) {
    try {
        const result = await Anime.findById(req.params.id);
        if (!result) {
            res.status(404).json({error: "Anime does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Anime ID"});
    }
}

async function updateAnime(req, res) {
    try {
        const result = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json({error: "Anime does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Anime ID or body"});
    }
}

async function deleteAnime(req, res) {
    try {
        const result = await Anime.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({error: "Anime does not exist"});
        } else {
            res.status(204).json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid Anime ID"});
    }
}

async function findReviewsByAnimeId(req, res) {
    try {
        const results = await Review.find({anime_id: req.params.id});
        res.json(results);
    } catch (e) {
        res.status(400).json({error: "Invalid Anime ID"});
    }
}

async function createReview(req, res) {
    try {
        req.body.anime_id = req.params.id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (e) {
        res.status(400).json({error: "Invalid Anime ID or body"});
    }
}

async function resetAnimeData(req, res) {
    try {
        const resultDelete = await Anime.deleteMany({});
        await Counter.reset(); // Reset the counter to 8 so preceding anime will correctly auto increment
        const resultInsert = await Anime.insertMany(originalAnimes);
        // console.log({...resultDelete, ...resultInsert});
        res.redirect("/anime");
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e.message});
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