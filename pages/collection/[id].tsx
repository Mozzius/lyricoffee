import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import { withIronSessionSsr } from "iron-session/next";

import { CollectionDetailsList, Layout } from "components";
import classes from "styles/Home.module.scss";
import { Collection, CollectionDetails, Song } from "types";
import { sessionOptions } from "utils/session";
import sql from "backend/db";

const Collection = () => {
  const {
    query: { id },
  } = useRouter();
  const { data } = useSWR<CollectionDetails>(`/api/collections/${id}`);

  return (
    <Layout className={classes.layout}>
      <h1>{data?.name}</h1>
      <p>{data?.description}</p>
      <CollectionDetailsList collection={data} />
    </Layout>
  );
};

export const getServerSideProps = withIronSessionSsr(async ({ params }) => {
  const id = params?.id as string;
  const query = await sql<Collection[]>`
    SELECT * FROM collections WHERE id = ${id}
  `;

  if (query.length === 0) throw new Error("Could not find collection");

  const songs = await sql<Song[]>`
    SELECT * FROM songs WHERE collection_id = ${id}
  `;

  return {
    props: {
      fallback: {
        [`/api/collections/${id}`]: {
          ...query[0],
          created_at: query[0].created_at.toISOString(),
          updated_at: query[0].updated_at.toISOString(),
          songs: songs.map((song) => ({
            ...song,
            created_at: song.created_at.toISOString(),
            updated_at: song.updated_at.toISOString(),
          })),
        },
      },
    },
  };
}, sessionOptions);

const Page: NextPage<{ fallback: CollectionDetails }> = ({ fallback }) => (
  <SWRConfig value={{ fallback }}>
    <Collection />
  </SWRConfig>
);

export default Page;
