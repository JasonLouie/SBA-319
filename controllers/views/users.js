import User from "../../models/userModel.js";
import Review from "../../models/reviewModel.js";
import originalUsers from "../../seed/users.js";
import mongoose from "mongoose";
import { error, validateLimit } from "../../functions/functions.js";

async function findAllUsers(req, res, next) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.userId ? await User.findById(req.query.userId) : await User.find({}).limit(limit);

        if (req.query.userId && !results) {
            next(error({user: "User not found"}, 404));
        } else {
            res.json(results);
        }
    } catch (err) {
        next(err);
    }
}

async function createUser(req, res, next) {
    try {
        validateUserBody(req.body);
        const userDoc = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        res.json(userDoc);
    } catch (err) {
        next(err);
    }
}

async function findUserById(req, res, next) {
    try {
        const result = await User.findById(req.params.id);
        if (!result) {
            next(error({user: "User not found"}, 404));
        } else {
            res.json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        validateUserBody(req.body, false);
        const result = await User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true});
        if (!result) {
            next(error({user: "User not found"}, 404));
        } else {
            res.json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            next(error({user: "User not found"}, 404));
        } else {
            res.status(204).json(result);
        }
    } catch (err) {
        next(err);
    }
}

async function findReviewsByUserId(req, res, next) {
    try {
        const results = await Review.find({ user_id: req.params.id });
        res.json(results);
    } catch (err) {
        next(err);
    }
}

async function createNewReview(req, res, next) {
    try {
        req.body.user_id = req.params.id;
        req.body.anime_id = req.params.anime_id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (err) {
        next(err);
    }
}

async function resetUserData(req, res, next) {
    try {
        const resultDelete = await User.deleteMany({});

        // Create static dev user
        const devUserData = {
            _id: new mongoose.Types.ObjectId("68f2ff6c36ffc14fdd3fcc6d"),
            name: "dev",
            username: "dev"
        };
        await User.db.collection("users").insertOne(devUserData);

        const resultInsert = await User.insertMany(originalUsers, {new: true});
        res.json(resultInsert);
    } catch (err) {
        next(err);
    }
}

function validateUserBody(body, create = true) {
    const expectedKeys = create ? ["name", "username", "email", "password"] : ["name", "email", "password"];
    const keyErrors = {};

    for (const key in body) {
        if (!expectedKeys.includes(key)) {
            keyErrors[key] = "Invalid key detected";
        }
    }

    if (!create && body.username != undefined) {
        keyErrors.username = "Username cannot be changed";
    }

    if (Object.keys(keyErrors).length > 0) {
        throw error(keyErrors);
    }
}

export default {
    findAllUsers,
    createUser,
    findUserById,
    updateUser,
    deleteUser,
    userReviews: findReviewsByUserId,
    createReview: createNewReview,
    seed: resetUserData
}