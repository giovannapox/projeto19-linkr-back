import { findByToken } from "../repositories/users.repository.js";

export default async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace(/bearer\s+/gi, "");

  try {
    const user = await findByToken(token);
    if (!user) return res.sendStatus(401);
    res.locals.user = user;
  } catch (err) {
    return res.sendStatus(401);
  }

  next();
}
