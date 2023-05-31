import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { signinSchema, signupSchema } from "../schemas/users.schema.js";

export async function signupValidation (req, res, next){
    const { email } = req.body;

    const validation = signupSchema.validate(req.body, { abortEarly: false});

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    };

    try {
        const verifyEmail = await db.query(`SELECT * from users WHERE email=$1;`, [email]);
        if (verifyEmail.rows.length !== 0) return res.status(409).send("E-mail já cadastrado!");
        
    } catch (err) {
        return res.status(500).send(err.message);
    };

    next();
};

export async function signinValidation(req, res, next) {
    const { email, password } = req.body;
    const validation = signinSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    };

    try {
        const verifyEmail = await db.query(`SELECT * from users WHERE email=$1;`, [email]);
        const userExists = verifyEmail.rows;
        if (userExists.length === 0) return res.status(401).send("E-mail não cadastrado!");

        const comparePassword = bcrypt.compareSync(password, userExists[0].password);
        if (!comparePassword) return res.status(401).send("Senha incorreta!");
    } catch (err) {
        return res.status(500).send(err.message);
    };

    next();
};