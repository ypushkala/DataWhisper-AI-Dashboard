import express from "express";
import {processQuery} from "../controllers/aiController.js";

const router = express.Router();

// POST /ai/query
router.post("/query", processQuery);

export default router;
