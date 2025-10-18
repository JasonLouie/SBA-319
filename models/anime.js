import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const animeSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
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
}, { _id: false, versionKey: false });

animeSchema.plugin(AutoIncrement);

const Anime = mongoose.model("Anime", animeSchema, "anime");
export default Anime;