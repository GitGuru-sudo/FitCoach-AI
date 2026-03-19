import { Router } from "express";

import { createWorkout, getWorkouts } from "../controllers/workoutController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyFirebaseToken, createWorkout);
router.get("/", verifyFirebaseToken, getWorkouts);

export default router;
