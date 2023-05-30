import { Router } from "express";
import { signupValidation } from "../middlewares/users.validation.js";
import { signup } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/signin");

export default router;