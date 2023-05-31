import { db } from "../database/database.connection.js";

export async function listTrendingHashtags() {
  const text = `
    SELECT
      ph."hashtagId" AS id,
      h.title,
      count(*) AS "postCount"
    FROM "postsHashtags" ph
    JOIN hashtags h ON ph."hashtagId" = h.id
    GROUP BY ph."hashtagId", h.title
    ORDER BY "postCount" DESC, title
    LIMIT 10;
  `;

  const { rows } = await db.query(text);
  return rows;
}
