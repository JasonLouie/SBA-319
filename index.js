import express from "express";
import methodOverride from "method-override";
import connectDB from "./db/conn.js";
import usersRouter from "./routes/users.js";
import animeRouter from "./routes/anime.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index");
});

// Middleware to set user_id to dev user's id for any route with reviews in it
// This is required because the application implementation will use forms without specifying a user_id (maybe)
app.use(/\/reviews/, (req, res, next) => {
    if (req.method === "POST" || req.method === "PATCH") {
        req.body.user_id = req.body.user_id || "68f2ff6c36ffc14fdd3fcc6d";
    }
    next();
});

app.use("/users", usersRouter);
app.use("/anime", animeRouter);
app.use("/reviews", reviewsRouter);

// Error handler
app.use((err, req, res, next) => {
    const messages = {};
    if (err.name === "ValidationError") {
        console.log("Mongoose ValidationError thrown");
        for (const key in err.errors) {
            messages[key] = err.errors[key].message;
        }
    } else if (err.name === "CastError") {
        console.log("Mongoose CastError thrown for ", err.path);
        messages[err.path] = err.kind === "ObjectId" ? "The string provided for the id must be a 24-character hexadecimal representation of an object id" : err.message;
    } else if (err.code && err.code === 11000) { // If validator fails to catch a uniqueness error from the validator, expect a MongoDB error
        console.log("MongoDB unique error thrown");
        const field = Object.keys(err.keyValue)[0];
        messages[field] = `${field[0].toUpperCase() + field.slice(1)} is taken`;
    } else if (err.error || err.errors) { // Custom error thrown
        console.log("Custom error thrown");
    } else {
        console.log("Error is not accounted for"); // 500
    }
    if (Object.keys(messages).length > 0 ) {
        res.status(400).json({errors: messages});
    } else {
        res.status(err.status || 500).json({ error: err.message });
    }
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Listening for connections on port: ${PORT}`);
});