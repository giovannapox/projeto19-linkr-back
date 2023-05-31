import express from "express";
import cors from "cors";
import usersRoute from "../src/routers/users.routers.js";
import postsRouter from "./routers/posts.routers.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(usersRoute);
app.use(postsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
