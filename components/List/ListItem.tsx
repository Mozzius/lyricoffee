import Link from "next/link";

import classes from "./List.module.scss";

interface Props {
  href: string;
  title: string;
  subtitle: string;
}

export const ListItem = ({ href, title, subtitle }: Props) => {
  return (
    <Link href={href}>
      <a className={classes.item}>
        <p className={classes.title}>{title}</p>
        <p className={classes.subtitle}>{subtitle}</p>
      </a>
    </Link>
  );
};
