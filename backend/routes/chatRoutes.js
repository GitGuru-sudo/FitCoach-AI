import { Router } from "express";

import { createChatReply, getChatHistory } from "../controllers/chatController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyFirebaseToken, createChatReply);
router.get("/history", verifyFirebaseToken, getChatHistory);

export default router;
