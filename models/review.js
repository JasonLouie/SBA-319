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

reviewSchema.index({ anime_id: 1, user_id: 1 }, { unique: true });
const Review = mongoose.model("review", reviewSchema, "reviews");
export default Review;