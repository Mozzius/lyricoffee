import hash from "utils/hash";
import { SQL } from "./db";

const initialise = async (sql: SQL) => {
  const [{ exists: userTableExists }] = await sql`
    SELECT EXISTS (
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'users'
    )
  `;

  if (!userTableExists) {
    console.log("User table not found, creating...");
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        login VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `;
    await sql`
      INSERT INTO users ${sql({
        login: "admin",
        password: hash("admin"),
        name: "Mr Admin",
      })}
    `;
  }
};

export default initialise;
