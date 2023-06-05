import { Router } from "express";
import { signinValidation, signupValidation } from "../middlewares/users.validation.js";
import { signin, signup } from "../controllers/users.controllers.js";
import validateToken from "../middlewares/validateToken.js";
import { searchUsers } from '../controllers/users.controllers.js';

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/signin", signinValidation, signin);
router.get('/user/search', validateToken, searchUsers);

export default router;