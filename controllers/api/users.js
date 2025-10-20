import * as userService from "../../services/userService.js";
import { createReview, getReviewsByUserId } from "../../services/reviewService.js";

// GET /users with optional query strings ?limit and/or ?userId
async function findAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (err) {
        next(err);
    }
}

// POST /users with body
async function createNewUser(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

// GET /users/:id
async function findUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/:id
async function updateUser(req, res, next) {
    try {
        const user = await userService.modifyUser(req.params.id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// DELETE /users/:id
async function deleteUser(req, res, next) {
    try {
        const user = await userService.removeUser(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// GET /users/:id/reviews
async function findReviewsByUser(req, res, next) {
    try {
        const reviews = await getReviewsByUserId(req.params.id);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
}

// POST /users/:id/reviews
async function createNewReview(req, res, next) {
    try {
        req.body.user_id = req.params.id;
        // Anime Id should be provided in the body. Otherwise proper err thrown
        const reviewDoc = await createReview(req.body);
        res.status(201).json(reviewDoc);
    } catch (err) {
        next(err);
    }
}

// GET /users/seed
async function resetUserData(req, res, next) {
    try {
        const results = await userService.resetUsers();
        res.json(results);
    } catch (err) {
        next(err);
    }
}

export default {
    findAllUsers,
    createUser: createNewUser,
    findUserById,
    updateUser,
    deleteUser,
    userReviews: findReviewsByUser,
    createReview: createNewReview,
    seed: resetUserData
}