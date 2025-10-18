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

app.use("/users", usersRouter);

// Middleware to set user_id to dev user's id for any route with reviews in it
app.use(/reviews/, (req, res, next) => {
    console.log(req.url);
    if(req.method === "POST" || req.method === "PATCH" || req.method === "DELETE"){
        req.body.userId = "68f2ff6c36ffc14fdd3fcc6d";
    }
    next();
});

app.use("/anime", animeRouter);
app.use("/reviews", reviewsRouter);

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({error: err.message});
});

// Only start server if the mongoose connection to mongoDB was successful
try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Listening for connections on port: ${PORT}`);
    });
} catch (e) {
    console.error(e);
}