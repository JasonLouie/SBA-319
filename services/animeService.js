import Anime from "../models/animeModel.js";
import Counter from "../models/counterModel.js";
import originalAnimes from "../seed/anime.js";
import { error, validateLimit } from "../utils/utils.js";

export async function getAllAnime(queryString) {
    if (queryString.animeId) {
        const anime = getAnimeById(queryString.animeId);
        return anime;
    }
    const limit = validateLimit(queryString.limit);

    const animes = await Anime.find({}).limit(limit);
    return animes;
}

export async function createAnime(animeBody) {
    validateAnimeBody(animeBody);
    const anime = await Anime.create({
        title: animeBody.title,
        genres: animeBody.genres,
        status: animeBody.status,
        type: animeBody.type,
        premiered: animeBody.premiered,
        episodes: animeBody.episodes
    });
    return anime;
}

export async function getAnimeById(animeId) {
    const anime = await Anime.findById(animeId);
    if (!anime) {
        throw error({ anime: "Anime not found" }, 404);
    }
    return anime;
}

export async function modifyAnime(animeId, animeBody) {
    validateAnimeBody(animeBody, false);
    const anime = await Anime.findByIdAndUpdate(animeId, animeBody, { runValidators: true, new: true });
    if (!anime) {
        throw error({ anime: "Anime not found" }, 404);
    }
    return anime;
}

export async function removeAnime(animeId) {
    const anime = await Anime.findByIdAndDelete(animeId);
    if (!anime) {
        throw error({ anime: "Anime not found" }, 404);
    }
    return anime;
}

export async function resetAnimes(req, res, next) {
    // Use Promise.all to run counter reset and deleting all anime simulataneously
    // Reset the counter to amount of anime seed data so preceding anime will correctly auto increment
    await Promise.all([Anime.deleteMany({}), Counter.reset(originalAnimes.length)]);
    const resultInsert = await Anime.insertMany(originalAnimes);
    return resultInsert;
}

function validateAnimeBody(body, create=true) {
    const keyErrors = {};

    if (body.premiered && typeof body.premiered != "number"){
        keyErrors.premiered = "Year Premiered must be a number";
    }

    if (body.episodes && typeof body.episodes != "number") {
        keyErrors.episodes = "Episodes must be a number";
    }

    if (!create && body._id != undefined) {
        keyErrors._id = "_id cannot be changed";
    }

    if (Object.keys(keyErrors).length > 0) {
        throw error(keyErrors);
    }
}