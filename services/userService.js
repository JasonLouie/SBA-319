import User from "../models/userModel.js";
import originalUsers from "../seed/users.js";
import mongoose from "mongoose";
import { error, validateLimit } from "../functions/functions.js";

export async function getAllUsers(queryString) {
    if (queryString.userId) {
        const user = getUserById(queryString.userId);
        return user;
    }
    const limit = validateLimit(limit);

    const users = await User.find({}).limit(limit);
    return users;
}

export async function createUser(userBody) {
    validateUserBody(userBody);
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
    validateUserBody(userBody, false);
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
    }
    return user;
}

export async function resetUsers() {
    await User.deleteMany({});

    // Create static dev user (not adhering to schema on purpose)
    const devUserData = {
        _id: new mongoose.Types.ObjectId("68f2ff6c36ffc14fdd3fcc6d"),
        name: "dev",
        username: "dev"
    };
    const [devResult, resultInsert] = await Promise.all([User.db.collection("users").insertOne(devUserData), await User.insertMany(originalUsers)]);
    
    return resultInsert;
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