import mongoose from "mongoose";
import Review from "./review.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        match: [/^[a-zA-Z0-9_.\s]+$/, "Name can only contain letters, numbers, underscores, periods, and white space"]
    },
    username: {
        type: String,
        immutable: [true, "Username cannot be changed"],
        unique: true,
        required: [true, "Username is required"],
        lowercase: true,
        minLength: [5, "Username must be at least 5 characters long"],
        match: [/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods"],
        validate: {
            validator: function (v) {
                const userModel = this.getQuery ? this.model : this.constructor;
                const userId = this.getQuery ? this.getQuery()._id: this._id;

                return userModel.findOne({ username: v, _id: {$ne: userId} }).then(user => !user);
            },
            message: "Username is taken"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        validate: {
            validator: function (v) {
                const userModel = this.getQuery ? this.model : this.constructor;
                const userId = this.getQuery ? this.getQuery()._id: this._id;

                return userModel.findOne({ email: v, _id: {$ne: userId} }).then(user => !user);
            },
            message: "Email is taken"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"]
    }
}, { versionKey: false, timestamps: true, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual("number_of_reviews");

// Middleware to display the number of reviews for an user whenever find is used
userSchema.post(/^find/, async function (docs, next) {
    try {
        if (docs) {
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
        }
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
});

const User = mongoose.model("user", userSchema, "users");
export default User;