import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: [
            "Currently Airing",
            "On Hiatus",
            "Finished Airing"
        ],
        required: true
    },
    type: {
        type: String,
        enum: [
            "TV",
            "Movie",
            "OVA"
        ],
        required: true
    },
    premiered: {
        type: Number,
        required: true,
        min: 1965,
        max: 2025
    },
    seasons: {
        type: Number,
        default: 1
    }
});

export default mongoose.model("Anime", animeSchema, "anime");