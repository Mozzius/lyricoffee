import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { Collection, CollectionDetails, Song } from "types";
import sql, { makeSureSongTableExists } from "backend/db";
import { sessionOptions } from "utils/session";

export default withIronSessionApiRoute(allCollectionsRoute, sessionOptions);

async function allCollectionsRoute(
  req: NextApiRequest,
  res: NextApiResponse<CollectionDetails[] | Collection | { message: string }>
) {
  const {
    query: { offset, limit },
    body: { name, description },
    method,
  } = req;
  try {
    const user = req.session.user;
    const userDetails = () => {
      if (!user || !user.isLoggedIn) throw new Error("Not authenticated");
      return user.details;
    };

    await makeSureSongTableExists();

    switch (method) {
      case "GET":
        const collectionQuery = await sql<Collection[]>`
          SELECT * FROM collections LIMIT ${limit} OFFSET ${offset}
        `;

        res.json(
          await Promise.all(
            collectionQuery.map((collection) =>
              (async () => ({
                ...collection,
                songs: await sql<Song[]>`
              SELECT * FROM songs WHERE collection_id = ${collection.id}`,
              }))()
            )
          )
        );
        break;
      case "POST":
        const { id: user_id } = userDetails();

        console.log(name, description);

        if (!name || (!!description && typeof description !== "string"))
          throw new Error("Invalid collection");

        const [collection] = await sql<Collection[]>`
          INSERT INTO collections ${sql({ user_id, name, description })}
          RETURNING *
        `;

        res.json(collection);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: (err as Error)?.message || "Internal Server Error" });
  }
}
