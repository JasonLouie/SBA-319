import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    anime_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        get: n => Math.round(n),
        set: n => Math.round(n),
        required: true,
        min: 0,
        max: 10
    },
    time_stamp: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("review", reviewSchema, "reviews");