import { Router } from "express";
import { listTrendingHashtagsController } from "../controllers/hashtags.controllers.js";

const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags/trending", listTrendingHashtagsController);

export default hashtagsRouter;
