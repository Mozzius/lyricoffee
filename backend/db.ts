import postgres from "postgres";

import initialise from "./initialise";
import type { UserDetailsBE } from "types";

import hash from "utils/hash";

const sql = postgres(process.env.DB_CONNECTION_STRING!, {
  connect_timeout: 10,
});

export type SQL = typeof sql;

// top level await would be nice!
// unfortunately broken in this version of Next.js
if (process.env.NODE_ENV === "development") initialise(sql);

export const getUserWithLoginAndPassword = async (
  login: string,
  password: string
) => {
  const hashedPwd = hash(password);
  const query = await sql<UserDetailsBE[]>`
    SELECT * FROM users 
    WHERE login = ${login} AND password = ${hashedPwd}
  `;

  if (query.length === 0)
    throw new Error("Could not find user with those details");

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
