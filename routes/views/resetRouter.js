import express from "express";
import resetDB from "../../controllers/views/reset.js";
const router = express.Router();

router.get("/", resetDB);

export default router;