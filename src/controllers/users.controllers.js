import bcrypt from "bcrypt";
import { db } from "../database/database.connection.js";

export async function signup(req, res){
    const { email, password, username, picture } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    try {
        await db.query(`
        INSERT INTO users 
        (email, password, username, picture) 
        VALUES ($1, $2, $3, $4);`,
        [email, hash, username, picture]);

        return res.sendStatus(201);
    } catch (err){
        return res.status(500).send(err.message);
    };
};