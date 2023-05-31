import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { postSchema } from "../schemas/posts.schema.js";
import {
  insertPostController,
  listPostsController,
} from "../controllers/posts.controllers.js";

const postsRouter = Router();

postsRouter.get("/posts", listPostsController);
postsRouter.post("/posts", validateBody(postSchema), insertPostController);

export default postsRouter;
