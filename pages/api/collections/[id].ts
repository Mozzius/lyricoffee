import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { Collection, CollectionDetails, Song } from "types";
import sql, { makeSureSongTableExists } from "backend/db";
import { sessionOptions } from "utils/session";

export default withIronSessionApiRoute(collectionRoute, sessionOptions);

async function collectionRoute(
  req: NextApiRequest,
  res: NextApiResponse<CollectionDetails | { message: string }>
) {
  const {
    query: { id },
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
          SELECT * FROM collections WHERE id = ${id}
        `;

        if (collectionQuery.length === 0)
          throw new Error("Could not find collection");

        res.json({
          ...collectionQuery[0],
          songs: await sql<Song[]>`
            SELECT * FROM songs WHERE collection_id = ${id}
          `,
        });
        break;
      case "PUT":
        const { id: userId } = userDetails();
        const collectionQuery2 = await sql<Collection[]>`
          SELECT * FROM collections WHERE id = ${id}
        `;

        if (collectionQuery2.length === 0)
          throw new Error("Could not find collection");

        if (collectionQuery2[0].user_id !== userId)
          throw new Error("You are not the owner of this collection");

        const [updated] = await sql<Collection[]>`
          UPDATE collections SET
            name = ${name},
            description = ${description},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;

        res.json({
          ...updated,
          songs: await sql<Song[]>`
            SELECT * FROM songs WHERE collection_id = ${id}
          `,
        });
        break;
      case "DELETE":
        const { id: userId2 } = userDetails();
        const collectionQuery3 = await sql<Collection[]>`
          SELECT * FROM collections WHERE id = ${id}
        `;

        if (collectionQuery3.length === 0)
          throw new Error("Could not find collection");

        if (collectionQuery3[0].user_id !== userId2)
          throw new Error("You are not the owner of this collection");

        await sql`
          DELETE FROM collections WHERE id = ${id}
        `;

        res.send({ message: "Collection deleted" });
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: (err as Error)?.message || "Internal Server Error" });
  }
}
