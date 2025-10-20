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
        required: [true, "Title is required"],
        unique: true,
        validate: {
            validator: function (v) {
                const animeModel = this.getQuery ? this.model : this.constructor;
                const animeId = this.getQuery ? this.getQuery()._id: this._id;

                return animeModel.findOne({ title: v, _id: {$ne: animeId} }).then(anime => !anime);
            },
            message: "Anime with that title already exists"
        },
        cast: "Title must be a string"
    },
    genres: {
        type: [String],
        required: [true, "Genres are required"],
        cast: "Genres must be an array of at least one genre",
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "Genres must be an array of at least one genre",
            validator: function (v) {
                v.forEach(g => {if (typeof g != "string") return false});
            },
            message: "Each genre must be a string"
        }
    },
    status: {
        type: String,
        enum: [
            "Ongoing",
            "Finished",
            "Not Aired"
        ],
        required: [true, "Status is required"],
        message: "{VALUE} is not a valid status for an anime"
    },
    type: {
        type: String,
        enum: [
            "TV",
            "Movie",
            "ONA"
        ],
        required: [true, "Type is required"],
        message: "{VALUE} is not a valid type of anime"
    },
    premiered: {
        type: Number,
        required: [true, "The year premiered is required"],
        min: [1965, "The year premiered must be at least 1995"],
    },
    episodes: {
        type: Number,
        default: 0,
        min: [0, "The number of episodes must be at least 0"]
    }
}, { _id: false, id: false, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

animeSchema.virtual("avg_user_rating");

animeSchema.plugin(AutoIncrement);

// Middleware to display the avg user rating for an anime whenever find is used
animeSchema.post(/^find/, async function (docs, next) {
    try {
        if (docs) {
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
        }
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
});

const Anime = mongoose.model("Anime", animeSchema, "anime");
export default Anime;