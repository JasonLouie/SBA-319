import * as userService from "../../services/userService.js";
import { getAllReviewsWithDetails, getReviewsByUserId } from "../../services/reviewService.js";

// GET /users (No query strings for now)
async function findAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers({});
        res.render("users/index", {
            pageTitle: "All Users | AniReview",
            users: users
        });
    } catch (err) {
        err.action = "Failed to Get All Users";
        next(err);
    }
}

// POST /users with body
async function createNewUser(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        res.redirect(`/demo/users/${user._id}`);
    } catch (err) {
        err.action = "Failed to Create User";
        next(err);
    }
}

// GET /users/create (Load create page)
async function showCreateUser(req, res, next) {
    try {
        res.render("users/create");
    } catch (err) {
        err.action = "Failed to Show Create User Page";
        next(err)
    }
}

// GET /users/:id
async function findUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.render("users/doc", {
            pageTitle: `${user.username} | AniReview`,
            user: user
        });
    } catch (err) {
        err.action = "Failed to Get User";
        next(err);
    }
}

// PATCH /users/:id
async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.params.id, req.body);
        res.redirect(`/demo/users/${req.params.id}`);
    } catch (err) {
        err.action = "Failed to Update User";
        next(err);
    }
}

// DELETE /users/:id
async function deleteUser(req, res, next) {
    try {
        await userService.removeUser(req.params.id);
        res.redirect("/demo/users");
    } catch (err) {
        err.action = "Failed to Delete User";
        next(err);
    }
}

// GET /users/:id/reviews (Does not work yet must fix)
// async function findReviewsByUserId(req, res, next) {
//     try {
//         const reviews = getAllReviewsWithDetails(req.params.id);
//         res.render("reviews/index", {
//             pageTitle: `Review for ${title} | AniReview`,
//             reviews: reviews
//         });
//     } catch (err) {
//         err.action = "Failed to Get Reviews for User"
//         next(err);
//     }
// }

// GET /user/seed
async function resetUserData(req, res, next) {
    try {
        await userService.resetUsers();
        res.redirect("/demo/users");
    } catch (err) {
        err.action = "Failed to Reset User";
        next(err);
    }
}

export default {
    findAllUsers,
    createUser: createNewUser,
    findUserById,
    updateUser,
    deleteUser,
    seed: resetUserData,
    create: showCreateUser
}