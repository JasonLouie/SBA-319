import express from "express";
import methodOverride from "method-override";
import connectDB from "./db/conn.js";
import usersRouter from "./routes/users.js";
import animeRouter from "./routes/anime.js";

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
app.use("/anime", animeRouter);

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