import User from "../models/user.js";
import Review from "../models/review.js";
import originalUsers from "../seed/users.js";

async function findAllUsers(req, res) {
    try {
        const results = await User.find({});
        res.json(results);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Bad request"});
    }
}

async function addUser(req, res) {
    try {
        const userDoc = await User.create(req.body);
        res.json(userDoc);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid body"});
    }
}

async function findUserById(req, res) {
    try {
        const result = await User.findById(req.params.id);
        if (!result) {
            res.status(404).json({error: "User does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid User ID"});
    }
}

async function updateUser(req, res) {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!result) {
            res.status(404).json({error: "User does not exist"});
        } else {
            res.json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid User ID or body"});
    }
}

async function deleteUser(req, res) {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({error: "User does not exist"});
        } else {
            res.status(204).json(result);
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({error: "Invalid User ID"});
    }
}

async function findReviewsByUserId(req, res) {
    try {
        const results = await Review.find({user_id: req.params.id});
        res.json(results);
    } catch (e) {
        res.status(400).json({error: "Invalid User ID"});
    }
}

async function createReview(req, res) {
    try {
        req.body.user_id = req.params.id;
        const reviewDoc = await Review.create(req.body);
        res.json(reviewDoc);
    } catch (e) {
        res.status(400).json({error: "Invalid User ID or body"});
    }
}

async function resetUserData(req, res) {
    try {
        const resultDelete = await User.deleteMany({});
        const resultInsert = await User.insertMany(originalUsers);
        console.log({...resultDelete, ...resultInsert});
        res.redirect("/users");
    } catch (e) {
        console.log(e.message)
        res.status(400).json({error: e.message});
    }
}

export default {
    findAllUsers,
    addUser,
    findUserById,
    updateUser,
    deleteUser,
    userReviews: findReviewsByUserId,
    createReview,
    seed: resetUserData
}