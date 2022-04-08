import clsx from "clsx";
import Head from "next/head";

import { Nav } from "..";
import classes from "./Layout.module.scss";

interface Props {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const Layout = ({ title, className, children }: Props) => {
  return (
    <div className={classes.container}>
      <Head>
        <title>{title ? `${title} | Lyricoffee` : "Lyricoffee"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className={clsx(classes.content, className)}>{children}</main>
    </div>
  );
};
