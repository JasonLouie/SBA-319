import User from "../models/user.js";
import Review from "../models/review.js";
import originalUsers from "../seed/users.js";
import mongoose from "mongoose";
import { formatError, validateLimit } from "../functions/functions.js";

async function findAllUsers(req, res) {
    try {
        const limit = validateLimit(req.query.limit);
        const results = req.query.userId ? await User.findById(req.query.userId) : await User.find({}).limit(limit);

        if (req.query.userId && !results) {
            res.status(404).json(error("User not found"));
        } else {
            res.json(results);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function createUser(req, res) {
    try {
        const userDoc = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        res.json(userDoc);
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function findUserById(req, res) {
    try {
        const result = await User.findById(req.params.id);
        if (!result) {
            res.status(404).json(error("User not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function updateUser(req, res) {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!result) {
            res.status(404).json(error("User not found"));
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function deleteUser(req, res) {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json(error("User not found"));
        } else {
            res.status(204).json(result);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function findReviewsByUserId(req, res) {
    try {
        const results = await Review.find({ user_id: req.params.id });
        res.json(results);
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function createReview(req, res) {
    try {
        req.body.user_id = req.params.id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (err) {
        console.log(err.message);
        res.status(400).json(formatError(err));
    }
}

async function resetUserData(req, res) {
    try {
        const resultDelete = await User.deleteMany({});

        // Create static dev user
        const devUserData = {
            _id: new mongoose.Types.ObjectId("68f2ff6c36ffc14fdd3fcc6d"),
            name: "dev",
            username: "dev"
        };
        await User.db.collection("users").insertOne(devUserData);

        const resultInsert = await User.insertMany(originalUsers);
        res.redirect("/users");
    } catch (err) {
        console.log(err.message)
        res.status(400).json(formatError(err));
    }
}

export default {
    findAllUsers,
    createUser,
    findUserById,
    updateUser,
    deleteUser,
    userReviews: findReviewsByUserId,
    createReview,
    seed: resetUserData
}