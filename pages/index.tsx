import { Layout } from "components";
import type { NextPage } from "next";

import useAuth from "utils/useAuth";
import classes from "styles/Home.module.scss";

const Home: NextPage = () => {
  const { user } = useAuth({ redirectTo: "/login" });

  if (!user || !user.details) return null;

  return (
    <Layout className={classes.layout}>
      <h1>Hello, {user.details.name} </h1>
      <pre className={classes.code}>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
};

export default Home;
