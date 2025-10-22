import User from "../models/userModel.js";
import { error, validateLimit } from "../utils/utils.js";
import { removeReviewsByUserId } from "./reviewService.js";

export async function getAllUsers(queryString) {
    if (queryString.userId) {
        const user = getUserById(queryString.userId);
        return user;
    }

    const limit = validateLimit(queryString.limit);
    const users = await User.find({}).limit(limit);
    
    return users;
}

export async function createUser(userBody) {
    // Validation is handled by the schema
    const user = await User.create({
        name: userBody.name,
        username: userBody.username,
        email: userBody.email,
        password: userBody.password
    });
    return user;
}

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw error({ user: "User not found" }, 404);
    }
    return user;
}

export async function modifyUser(userId, userBody) {
    // Prevent updating username
    if (userBody.username != undefined) {
        userBody.username = undefined;
    }
    const user = await User.findByIdAndUpdate(userId, userBody, { runValidators: true, new: true });
    if (!user) {
        throw error({ user: "User not found" }, 404);
    }
    return user;
}

export async function removeUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw error({ user: "User not found" }, 404);
    } else {
        await removeReviewsByUserId(userId);
    }
    return user;
}