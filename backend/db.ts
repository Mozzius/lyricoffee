import postgres from "postgres";

import type { UserDetailsBE } from "types";

import hash from "utils/hash";

const sql = postgres(process.env.DB_CONNECTION_STRING!, {
  connect_timeout: 10,
});

export type SQL = typeof sql;

export const makeSureUserTableExists = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
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
    ON CONFLICT DO NOTHING
  `;
};

export const getUserWithLoginAndPassword = async (
  login: string,
  password: string
) => {
  const hashedPwd = hash(password);
  const query = await sql<UserDetailsBE[]>`
    SELECT * FROM users 
    WHERE login = ${login}
  `;

  if (query.length === 0)
    throw new Error("Could not find user with that login");

  if (query[0].password !== hashedPwd) throw new Error("Password is incorrect");

  return query[0];
};

export const createUser = async (
  login: string,
  password: string,
  name: string
) => {
  const hashedPwd = hash(password);
  const [{ exists: userExists }] = await sql`
    SELECT EXISTS (
      SELECT * FROM users 
      WHERE login = ${login}
    )
  `;

  if (userExists) throw new Error(`User with login "${login}" already exists`);

  const [user] = await sql<UserDetailsBE[]>`
    INSERT INTO users ${sql({ login, name, password: hashedPwd })}
    RETURNING *
  `;

  return user;
};

export default sql;
