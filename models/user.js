import mongoose from "mongoose";
import Review from "./review.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        immutable: true,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, { versionKey: false, timestamps: true, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual("number_of_reviews");

// Middleware to display the number of reviews for an user whenever find is used
userSchema.post(/^find/, async function (docs, next) {
    try {
        // Turns the result (docs) into an array if only one result is found
        const userDocs = Array.isArray(docs) ? docs : [docs];
        const userIds = userDocs.map(doc => doc._id);

        // Find number of reviews for those users
        const reviewCounts = await Review.aggregate([
            {
                $match: {
                    user_id: {
                        $in: userIds
                    }
                }
            },
            {
                $group: {
                    _id: "$user_id",
                    number_of_reviews: {
                        $sum: 1
                    }
                }
            }
        ]);
        
        // Store review count in an obj for easy access
        const reviewCountsObj = {};
        reviewCounts.forEach(r => reviewCountsObj[r._id] = r.number_of_reviews);

        // Iterate through user docs and set the number_of_reviews field
        userDocs.forEach(doc => {
            doc.set("number_of_reviews", reviewCountsObj[doc._id] || 0, { strict: false });
        });
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
});

const User = mongoose.model("user", userSchema, "users");
export default User;