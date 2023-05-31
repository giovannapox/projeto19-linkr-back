import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().trim().required(),
  url: Joi.string()
    .uri({ scheme: /https?/ })
    .required(),
});
