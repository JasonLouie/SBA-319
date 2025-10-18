import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        immutable: true,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, { versionKey: false, timestamps: true });

const User = mongoose.model("user", userSchema, "users");
export default User;