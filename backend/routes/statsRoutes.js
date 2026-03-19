import { Router } from "express";

import { getStats } from "../controllers/statsController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyFirebaseToken, getStats);

export default router;
