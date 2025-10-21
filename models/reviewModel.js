import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    anime_id: {
        type: Number,
        required: [true, "Anime Id is required"],
        cast: "Anime Id must be a number",
        ref: "Anime"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "User Id is required"],
        cast: "The string provided for the User Id must be a 24-character hexadecimal representation of an objectid",
        ref: "user"
    },
    comment: {
        type: String,
        default: "",
        cast: "Comment must be a string"
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [0, "Rating cannot be less than 0"],
        max: [10, "Rating cannot be greater than 10"],
        cast: "Rating must be a number",
        validate: {
            validator: function (v) {
                return Number.isInteger(v);
            },
            message: "Rating must be an integer"
        }
    }
}, { versionKey: false, timestamps: true });

reviewSchema.index({ anime_id: 1, user_id: 1 }, { unique: true });
const Review = mongoose.model("review", reviewSchema, "reviews");
export default Review;