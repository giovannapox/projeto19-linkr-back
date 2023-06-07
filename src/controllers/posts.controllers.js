import { listPostsWithMetadata } from "../services/posts.services.js";
import {
  insertPost,
  likePost,
  unlikePost,
  getPostsByUserId,
} from "../repositories/posts.repository.js";

export async function listPostsController(req, res) {
  const { author, hashtag } = req.query;
  const { user } = res.locals;

  try {
    const posts = await listPostsWithMetadata(user.id, author, hashtag);
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

export async function likePostController(req, res) {
  const { user, id } = res.locals;

  try {
    const likeCount = await likePost(user.id, id);
    return res.send(likeCount);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function unlikePostController(req, res) {
  const { user, id } = res.locals;

  try {
    const likeCount = await unlikePost(user.id, id);
    return res.send(likeCount);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function getUserPosts(req, res) {
  const { id } = req.params;
  try {
    const posts = await getPostsByUserId(id)
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}