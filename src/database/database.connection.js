import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const configDataBase = {
  connectionString: process.env.DATABASE_URL,
};

const { Pool, types } = pg;

types.setTypeParser(1114, (stringValue) => stringValue);

if (process.env.MODE === "prod") configDataBase.ssl = true;

export const db = new Pool(configDataBase);
