import { db } from "../database/database.connection.js";
import parseHashtags from "../utils/parseHashtags.js";

export async function insertPost(userId, caption, url) {
  const client = await db.connect();
  const hashtags = parseHashtags(caption);

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

    const postId = insertPostResult.rows[0].id;

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
