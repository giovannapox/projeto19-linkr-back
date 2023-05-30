import joi from "joi";

export const signupSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().required(),
    picture: joi.string().uri().required()
});

export const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});