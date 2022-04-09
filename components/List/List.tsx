import clsx from "clsx";
import Link from "next/link";
import { Children } from "react";

import classes from "./List.module.scss";

interface Props {
  title: string;
  addButton?: {
    href: string;
    children: React.ReactNode;
  };
  children: React.ReactNode;
}

export const List = ({ title, addButton, children }: Props) => {
  console.log(Children.count(children));
  return (
    <div className={classes.container}>
      <div
        className={clsx(classes.header, {
          [classes.hasContent]: Children.count(children) > 0,
        })}
      >
        <p className={classes.title}>{title}</p>
        {addButton && (
          <Link href={addButton.href}>
            <a className={classes.addButton}>{addButton.children}</a>
          </Link>
        )}
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};
