import express from "express";
import resetDB from "../../controllers/api/reset.js";
const router = express.Router();

router.get("/", resetDB);

export default router;