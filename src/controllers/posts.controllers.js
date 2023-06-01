import { insertPost, listPosts } from "../repositories/posts.repository.js";

export async function listPostsController(req, res) {
  const { author, hashtag } = req.query;
  const { user } = res.locals;

  try {
    const posts = await listPosts(user.id, author, hashtag);
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function insertPostController(req, res) {
  const { caption, url } = res.locals.body;
  const { user } = res.locals;

  try {
    const post = await insertPost(user.id, caption, url);
    return res.status(201).send(post);
  } catch (err) {
    if (err.constraint === "posts_userId_fkey") {
      return res.sendStatus(422);
    }

    console.error(err);
    return res.status(500).send(err);
  }
}
