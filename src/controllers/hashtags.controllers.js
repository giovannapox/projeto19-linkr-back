import { listTrendingHashtags } from "../repositories/hashtags.repository.js";

export async function listTrendingHashtagsController(req, res) {
  try {
    const hashtags = await listTrendingHashtags();
    return res.send(hashtags);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
