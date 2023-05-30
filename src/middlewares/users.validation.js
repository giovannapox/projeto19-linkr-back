import { db } from "../database/database.connection.js";
import { signupSchema } from "../schemas/users.schema.js";

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