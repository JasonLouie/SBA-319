import User from "../models/user.js";
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

async function resetUserData() {
    try {
        const resultDelete = User.deleteMany({});
        const resultInsert = User.insertMany(originalUsers);
        console.log({...resultDelete, ...resultInsert});
        res.redirect("/users");
    } catch (e) {
        console.log(e.message)
        res.status(400).json({error: e.message});
    }
}

export default {
    findAllUsers,
    findUserById,
    reset: resetUserData
}