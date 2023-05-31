import { insertPost } from "../repositories/posts.repository.js";

export async function insertPostController(req, res) {
  const { id, caption, url } = res.locals.body;

  try {
    const post = await insertPost(id, caption, url);
    return res.status(201).send(post);
  } catch (err) {
    if (err.constraint === "posts_userId_fkey") {
      return res.sendStatus(422);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}
