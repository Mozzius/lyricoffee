import { CollectionDetails } from "types";
import { List } from "./List";
import { ListItem } from "./ListItem";

interface Props {
  collection?: CollectionDetails;
}

export const CollectionDetailsList = ({ collection }: Props) => {
  return (
    <List
      title={collection ? "Songs" : "Loading..."}
      addButton={
        collection && {
          href: `/song/create/${collection.id}`,
          children: "+",
        }
      }
    >
      {collection &&
        collection.songs.map((song) => (
          <ListItem
            key={song.id}
            title={song.name}
            subtitle={`${song.album}, ${song.artist}`}
            href={`/song/${song.id}`}
          />
        ))}
    </List>
  );
};
