import express from "express";
import methodOverride from "method-override";
import connectDB from "./db/conn.js";

import usersApiRouter from "./routes/api/userRouter.js";
import animeApiRouter from "./routes/api/animeRouter.js";
import reviewsApiRouter from "./routes/api/reviewRouter.js";
import resetApiRouter from "./routes/api/resetRouter.js"

import usersViewsRouter from "./routes/views/userRouter.js";
import animeViewsRouter from "./routes/views/animeRouter.js";
import reviewsViewsRouter from "./routes/views/reviewRouter.js";
import resetViewsRouter from "./routes/views/resetRouter.js";

import { timeOptions } from "./utils/utils.js";

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride("_method"));

// Middleware that logs what request was made (method, url) and the time it was made.
app.use((req, res, next) => {
    console.log(`Request made: ${req.method} ${req.url} at ${new Date().toLocaleTimeString("en-US", timeOptions)}`);
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/api/users", usersApiRouter);
app.use("/api/anime", animeApiRouter);
app.use("/api/reviews", reviewsApiRouter);
app.use("/api/reset", resetApiRouter);

app.use("/demo/users", usersViewsRouter);
app.use("/demo/anime", animeViewsRouter);
app.use("/demo/reviews", reviewsViewsRouter);
app.use("/demo/reset", resetViewsRouter);

// Error handler
app.use((err, req, res, next) => {
    // Format errors
    let errorType = "Unanticipated Error";
    const messages = {};
    if (err.name === "ValidationError") {
        errorType = "Mongoose ValidationError";
        console.log("Mongoose ValidationError thrown")
        for (const key in err.errors) {
            messages[key] = err.errors[key].message;
        }
    } else if (err.name === "CastError") {
        errorType = "Mongoose CastError";
        console.log(`Mongoose CastError thrown for ${err.path}`);
        messages[err.path] = err.kind === "ObjectId" ? "The string provided for the id must be a 24-character hexadecimal representation of an object id" : err.message;
    } else if (err.code && err.code === 11000) { // If validator fails to catch a uniqueness error from the validator, expect a MongoDB error
        errorType = "MongoDB unique error thrown";
        console.log("MongoDB unique error thrown");
        const field = Object.keys(err.keyValue)[0];
        messages[field] = `${field[0].toUpperCase() + field.slice(1)} is taken`;
    } else if (err.custom) { // Custom error thrown
        switch (err.status) {
            case 400:
                errorType = "Bad Request"
                break;
            case 404:
                errorType = "Not Found";
                break;
            case 409:
                errorType = "Conflict";
            default:
                break;
        }
        console.log("Custom error thrown")
    }

    // Handle sending demo errors
    if (req.url.startsWith("/demo")) { 
        const error = Object.keys(messages).length > 0 ? messages : err.message;
        res.render("error", {messages: error, pageTitle: errorType, failedAction: err.action});
    } else { // Handle sending api errors
        if (Object.keys(messages).length > 0) {
            res.status(400).json({errors: messages});
        } else {
            res.status(err.status || 500).json({ errors: err.message });
        }
    }
    
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Listening for connections on port: ${PORT}`);
});