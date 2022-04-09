import { CollectionsList, Layout } from "components";
import type { NextPage } from "next";
import useAuth from "utils/useAuth";
import classes from "styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <Layout className={classes.layout}>
      <h1>Welcome to Lyricoffee ☕️</h1>
      <CollectionsList />
    </Layout>
  );
};

export default Home;
