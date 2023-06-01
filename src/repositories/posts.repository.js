import { db } from "../database/database.connection.js";
import parseHashtags from "../utils/parseHashtags.js";

export async function listPosts(userId, authorId, hashtag) {
  const whereConditions = [];
  const values = [userId];
  let placeholder = 2;

  if (authorId) {
    whereConditions.push(`u.id = $${placeholder}`);
    values.push(authorId);
    placeholder++;
  }

  if (hashtag) {
    whereConditions.push(`h.title = $${placeholder}`);
    values.push(hashtag);
  }

  const whereClause =
    whereConditions.length !== 0 ? whereConditions.join(" AND ") : "TRUE";

  const text = `
    SELECT
      p.id,
      p.caption,
      p.url,
      p."createdAt",
      json_build_object(
        'id', u.id,
        'name', u.name,
        'pictureUrl', u."pictureUrl"
      ) AS author,
      (
        SELECT count(*)::integer
        FROM "postLikes" pl
        WHERE pl."postId" = p.id
      ) AS "likesCount",
      exists(
        SELECT 1
        FROM "postLikes" pl
        WHERE pl."userId" = $1 AND pl."postId" = p.id
      ) AS liked
    FROM posts p
    JOIN users u ON u.id = p."userId"
    LEFT JOIN "postsHashtags" ph ON ph."postId" = p.id
    LEFT JOIN hashtags h ON h.id = ph."hashtagId"
    WHERE ${whereClause}
    ORDER BY p."createdAt" DESC, p.id DESC
    LIMIT 20
  `;

  const { rows } = await db.query(text, values);
  return rows;
}

export async function insertPost(userId, caption, url) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const insertPostText = `
      INSERT INTO posts
        ("userId", caption, url)
      VALUES
        ($1, $2, $3)
      RETURNING *
    `;

    const insertPostValues = [userId, caption, url];
    const insertPostResult = await client.query(
      insertPostText,
      insertPostValues
    );

    if (!caption) {
      await client.query("COMMIT");
      return insertPostResult.rows;
    }

    const postId = insertPostResult.rows[0].id;
    const hashtags = parseHashtags(caption);

    const placeholders = Array.from(
      { length: hashtags.length },
      (_, i) => i + 1
    ).map((i) => `$${i}`);

    const hashtagsValuesClause = placeholders
      .map((placeholder) => `(${placeholder})`)
      .join(", ");

    // Return all ids from parsed hashtags while
    // inserting ones that do not exist in the table
    const insertHashtagsText = `
      WITH
      input_rows(title) AS (
        VALUES ${hashtagsValuesClause}
      ),
      inserted_rows AS (
        INSERT INTO hashtags (title)
        SELECT title FROM input_rows
        ON CONFLICT (title) DO NOTHING
        RETURNING id
      )
      SELECT ir.id FROM inserted_rows ir
      UNION ALL
      SELECT h.id
      FROM input_rows
      JOIN hashtags h USING (title)
    `;

    const insertHashtagsResult = await client.query(
      insertHashtagsText,
      hashtags
    );

    const hashtagsIds = insertHashtagsResult.rows.map((row) => row.id);
    const postIdPlaceholder = `$${placeholders.length + 1}`;
    const insertPostsHashtagsValuesClause = placeholders
      .map((placeholder) => `(${postIdPlaceholder}, ${placeholder})`)
      .join(", ");

    const insertPostsHashtagsText = `
      INSERT INTO "postsHashtags"
        ("postId", "hashtagId")
      VALUES
        ${insertPostsHashtagsValuesClause}
    `;

    await client.query(insertPostsHashtagsText, [...hashtagsIds, postId]);
    await client.query("COMMIT");

    return insertPostResult.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
