import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { postSchema } from "../schemas/posts.schema.js";
import { insertPostController } from "../controllers/posts.controllers.js";

const postsRouter = Router();

postsRouter.post("/posts", validateBody(postSchema), insertPostController);

export default postsRouter;
