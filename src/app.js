import express from "express";
import cors from "cors";
import usersRoute from "../src/routers/users.routers.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(usersRoute);

const PORT = 5000
app.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`)});