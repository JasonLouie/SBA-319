import Anime from "../models/animeModel.js";
import { error, validateLimit } from "../utils/utils.js";
import { removeReviewsByAnimeId } from "./reviewService.js";

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
    validateAnimeBody(animeBody);
    if (animeBody._id != undefined) {
        animeBody._id = undefined;
    }
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
    } else {
        await removeReviewsByAnimeId(animeId);
    }
    return anime;
}

function validateAnimeBody(body) {
    const keyErrors = {};

    if (body.premiered && typeof body.premiered != "number"){
        keyErrors.premiered = "Year Premiered must be a number";
    }

    if (body.episodes && typeof body.episodes != "number") {
        keyErrors.episodes = "Episodes must be a number";
    }

    if (Object.keys(keyErrors).length > 0) {
        throw error(keyErrors);
    }
}