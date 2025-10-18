import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import Review from "./review.js";

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
            "Finished",
            "Not Aired"
        ],
        required: true,
        message: "{VALUE} is not a valid status for an anime"
    },
    type: {
        type: String,
        enum: [
            "TV",
            "Movie",
            "ONA"
        ],
        required: true,
        message: "{VALUE} is not a valid type of anime"
    },
    premiered: {
        type: Number,
        required: true,
        min: 1965,
        message: "The year premiered must be at least 1995"
    },
    episodes: {
        type: Number,
        default: 0,
        min: 0,
        message: "The number of episodes must be at least 0"
    }
}, { _id: false, id: false, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

animeSchema.virtual("avg_user_rating");

animeSchema.plugin(AutoIncrement);

// Middleware to display the avg user rating for an anime whenever find is used
animeSchema.post(/^find/, async function (docs, next) {
    try {
        // Turns the result (docs) into an array if only one result is found
        const animeDocs = Array.isArray(docs) ? docs : [docs];
        const animeIds = animeDocs.map(doc => doc._id);

        // Find avg user rating for those anime
        const averages = await Review.aggregate([
            {
                $match: {
                    anime_id: {
                        $in: animeIds
                    }
                }
            },
            {
                $group: {
                    _id: "$anime_id",
                    avg_user_rating: {
                        $avg: "$rating"
                    }
                }
            }
        ]);
        
        // Store averages in an obj for easy access
        const averagesObj = {};
        averages.forEach(avg => averagesObj[avg._id] = Number(avg.avg_user_rating.toFixed(2)));

        // Iterate through anime docs and set the avg_user_rating field
        animeDocs.forEach(doc => {
            doc.set("avg_user_rating", averagesObj[doc._id] || null, { strict: false });
        });
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
});

const Anime = mongoose.model("Anime", animeSchema, "anime");
export default Anime;