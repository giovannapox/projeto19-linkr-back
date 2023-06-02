import urlMetadata from "url-metadata";
import { listPosts } from "../repositories/posts.repository.js";

export async function listPostsWithMetadata(userId, authorId, hashtag) {
  const posts = await listPosts(userId, authorId, hashtag);
  const metadataPromises = posts.map((post) => urlMetadata(post.url));
  const metadataResults = await Promise.allSettled(metadataPromises);

  posts.forEach((post, index) => {
    const result = metadataResults[index];

    if (result.status === "rejected") {
      post.urlMeta = { url: "", image: "", title: "", description: "" };
    }

    const meta = result.value;

    post.urlMeta = {
      url: meta.url || meta["og:url"] || meta["twitter:url"],
      image: meta.image || meta["og:image:secure_url"] || meta["twitter:image"],
      title: meta.title || meta["og:title"] || meta["twitter:title"],
      description:
        meta.description ||
        meta["og:description"] ||
        meta["twitter:description"],
    };
  });

  return posts;
}
