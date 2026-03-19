import { Router } from "express";

import { generateMotivation } from "../controllers/aiController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

router.post("/motivation", verifyFirebaseToken, generateMotivation);

export default router;
