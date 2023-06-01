import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().trim().default(null),
  url: Joi.string()
    .uri({ scheme: /https?/ })
    .required(),
});
