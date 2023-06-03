import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { postSchema } from "../schemas/posts.schema.js";
import validateToken from "../middlewares/validateToken.js";
import {
  insertPostController,
  likePostController,
  listPostsController,
  unlikePostController,
} from "../controllers/posts.controllers.js";
import validateId from "../middlewares/validateId.js";

const postsRouter = Router();

postsRouter.get("/posts", validateToken, listPostsController);
postsRouter.post(
  "/posts",
  validateToken,
  validateBody(postSchema),
  insertPostController
);

postsRouter.post(
  "/posts/:id/like",
  validateToken,
  validateId,
  likePostController
);

postsRouter.post(
  "/posts/:id/unlike",
  validateToken,
  validateId,
  unlikePostController
);

export default postsRouter;
