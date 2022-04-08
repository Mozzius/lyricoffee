import type { NextPage } from "next";
import { useState } from "react";

import { Layout } from "components";
import fetchApi, { FetchError } from "utils/fetchApi";
import useAuth from "utils/useAuth";
import classes from "styles/Auth.module.scss";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateUser } = useAuth({
    redirectTo: "/",
    redirectIfFound: true,
  });

  return (
    <Layout title="Log in">
      <form
        className={classes.form}
        onSubmit={async (event) => {
          event.preventDefault();

          try {
            mutateUser(
              await fetchApi("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: email, password }),
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
        <h1>Log in</h1>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={classes.error}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </Layout>
  );
};

export default Login;
