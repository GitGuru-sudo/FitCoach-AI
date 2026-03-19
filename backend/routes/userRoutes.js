import { Router } from "express";

import { getCurrentUser, upsertProfile } from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

router.get("/me", verifyFirebaseToken, getCurrentUser);
router.post("/profile", verifyFirebaseToken, upsertProfile);

export default router;
