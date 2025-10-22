import User from "../models/userModel.js";
import Anime from "../models/animeModel.js";
import Review from "../models/reviewModel.js";
import Counter from "../models/counterModel.js";
import originalUsers from "../seed/users.js";
import originalAnimes from "../seed/anime.js";
import originalReviews from "../seed/reviews.js";
import { error } from "../utils/utils.js";

export default async function resetDatabase(req, res, next) {

    // Use Promise.all to run counter reset and deleting all data simulataneously
    // Reset the counter to amount of anime seed data so preceding anime will correctly auto increment
    await Promise.all([User.deleteMany({}), Anime.deleteMany({}), Review.deleteMany({}), Counter.reset(originalAnimes.length)]);
    
    // Use Promise.all to run all inserts
    const [userInsert, animeInsert, reviewInsert] = await Promise.all([User.insertMany(originalUsers), Anime.insertMany(originalAnimes), Review.insertMany(originalReviews)]);

    if (userInsert.length === originalUsers.length && animeInsert.length === originalAnimes.length && reviewInsert.length === originalReviews.length) {
        return "Succesfully reset database!";
    } else {
        throw error("Missing data!");
    }
}