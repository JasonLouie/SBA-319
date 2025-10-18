import User from "../models/user.js";
import Review from "../models/review.js";
import originalUsers from "../seed/users.js";
import mongoose from "mongoose";

async function findAllUsers(req, res) {
    try {
        if (req.query.limit && isNaN(req.query.limit)) {
            throw { message: "Limit provided is not a number" };
        }
        const limit = Number(req.query.limit) || 25;
        const query = {};
        if (req.query.userId) {
            query._id = req.query.userId;
        }
        const results = await User.find(query).limit(limit);
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: e.message });
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
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid body" });
    }
}

async function findUserById(req, res) {
    try {
        const result = await User.findById(req.params.id);
        if (!result) {
            res.status(404).json({ error: "User does not exist" });
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid User ID" });
    }
}

async function updateUser(req, res) {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!result) {
            res.status(404).json({ error: "User does not exist" });
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid User ID or body" });
    }
}

async function deleteUser(req, res) {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ error: "User does not exist" });
        } else {
            res.status(204).json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid User ID" });
    }
}

async function findReviewsByUserId(req, res) {
    try {
        const results = await Review.find({ user_id: req.params.id });
        res.json(results);
    } catch (e) {
        res.status(400).json({ error: "Invalid User ID" });
    }
}

async function createReview(req, res) {
    try {
        req.body.user_id = req.params.id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (e) {
        res.status(400).json({ error: "Invalid User ID or body" });
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
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ error: e.message });
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