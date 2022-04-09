import type { NextPage } from "next";
import { useState } from "react";

import { Layout } from "components";
import fetchApi, { FetchError } from "utils/fetchApi";
import useAuth from "utils/useAuth";
import classes from "styles/Forms.module.scss";

const Register: NextPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateUser } = useAuth({
    redirectTo: "/",
    redirectIfFound: true,
  });

  return (
    <Layout title="Register">
      <form
        className={classes.form}
        onSubmit={async (event) => {
          event.preventDefault();

          try {
            mutateUser(
              await fetchApi("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: email, name, password }),
              })
            );
          } catch (error) {
            if (error instanceof FetchError) {
              setError(error.data.message);
            } else {
              setError("Could not log you in. Please try again");
              console.error("Login error:", error);
            }
          }
        }}
      >
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={classes.error}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </Layout>
  );
};

export default Register;
