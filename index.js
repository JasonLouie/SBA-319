import express from "express";
import connectDB from "./db/conn.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({error: err.message});
});

try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Listening for connections on port: ${PORT}`);
    });
} catch (e) {
    console.error(e);
}