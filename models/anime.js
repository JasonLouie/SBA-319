import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    genres: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: [
            "Ongoing",
            "Finished"
        ],
        required: true
    },
    type: {
        type: String,
        enum: [
            "TV",
            "Movie",
            "ONA"
        ],
        required: true
    },
    premiered: {
        type: Number,
        required: true,
        min: 1965,
        max: 2025
    },
    episodes: {
        type: Number,
        required: true,
        min: 1
    }
});

const Anime = mongoose.model("Anime", animeSchema, "anime");
export default Anime;