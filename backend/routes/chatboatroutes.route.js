import express from "express";
import { chatboat } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.route("/ask").post(chatboat);

export default router;