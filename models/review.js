import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    anime_id: {
        type: Number,
        ref: "Anime",
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    reviewText: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
}, { versionKey: false, timestamps: true });

reviewSchema.index({ anime_id: 1, user_id: 1 }, { unique: true });
const Review = mongoose.model("review", reviewSchema, "reviews");
export default Review;