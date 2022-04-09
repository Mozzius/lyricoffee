import useSWRInfinite from "swr/infinite";

import { CollectionDetails } from "types";
import { List } from "./List";
import classes from "styles/Forms.module.scss";
import { ListItem } from "./ListItem";

interface Props {}

const LIMIT = 10;

const getKey = (offset: number, previousPageData: CollectionDetails[]) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `/api/collections?offset=${offset * LIMIT}&limit=${LIMIT}`; // SWR key
};

export const CollectionsList = ({}: Props) => {
  const { data, setSize } = useSWRInfinite<CollectionDetails[]>(getKey);

  return (
    <List
      title={data ? "Collections" : "Loading..."}
      addButton={
        data && {
          href: "/collection/create",
          children: "+",
        }
      }
    >
      {data && (
        <>
          {data.flat().map((collection) => (
            <ListItem
              key={collection.id}
              title={collection.name}
              subtitle={`${collection.songs.length} songs`}
              href={`/collection/${collection.id}`}
            />
          ))}
          {data[data.length - 1].length === LIMIT && (
            <button
              className={classes.button}
              onClick={() => setSize((s) => s + 1)}
            >
              Load More
            </button>
          )}
        </>
      )}
    </List>
  );
};
