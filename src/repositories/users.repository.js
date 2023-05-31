import { db } from "../database/database.connection.js";

export async function findByToken(token) {
  const text = `
    SELECT
      u.id,
      u.name,
      u."pictureUrl"
    FROM tokens t
    JOIN users u ON t."userId" = u.id
    WHERE t.token = $1
  `;

  const { rows } = await db.query(text, [token]);
  return rows.length !== 0 ? rows[0] : null;
}
