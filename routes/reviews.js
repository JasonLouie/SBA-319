import express from "express";

const router = express.Router();

router.route("/")
    .get()
    .post();

// Get reviews that are at least 8/10
router.get("/great");

router.get("/:id");
