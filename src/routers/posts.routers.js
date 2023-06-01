import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { postSchema } from "../schemas/posts.schema.js";
import validateToken from "../middlewares/validateToken.js";
import {
  insertPostController,
  listPostsController,
  getUserPostsController,
} from "../controllers/posts.controllers.js";

const postsRouter = Router();

postsRouter.get("/posts", validateToken, listPostsController);
postsRouter.post(
  "/posts",
  validateToken,
  validateBody(postSchema),
  insertPostController
);
postsRouter.get("/user/:id", validateToken, getUserPostsController);

export default postsRouter;
