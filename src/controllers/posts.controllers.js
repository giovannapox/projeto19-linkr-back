import { insertPost, listPosts } from "../repositories/posts.repository.js";

export async function listPostsController(req, res) {
  const { author, hashtag } = req.query;
  const userId = 1;

  try {
    const posts = await listPosts(userId, author, hashtag);
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

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
