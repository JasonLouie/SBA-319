import Anime from "../models/anime.js";
import Review from "../models/review.js";
import originalAnimes from "../seed/anime.js";

async function findAllAnimes(req, res) {
    try {
        const results = await Anime.find({});
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Bad request"});
    }
}

async function addAnime(req, res) {
    try {
        const animeDoc = await Anime.create(req.body);
        res.json(animeDoc);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid body"});
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
        const result = await Anime.findByIdAndUpdate(req.params.id, req.body);
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
        const resultInsert = await Anime.insertMany(originalAnimes);
        console.log({...resultDelete, ...resultInsert});
        res.redirect("/animes");
    } catch (e) {
        console.log(e.message)
        res.status(400).json({error: e.message});
    }
}

export default {
    findAllAnimes,
    addAnime,
    findAnimeById,
    updateAnime,
    deleteAnime,
    animeReviews: findReviewsByAnimeId,
    createReview,
    seed: resetAnimeData
}