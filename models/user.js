import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        immutable: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: {
        type: [mongoose.Types.ObjectId],
        default: []
    }
});

export default mongoose.model("user", userSchema, "users");