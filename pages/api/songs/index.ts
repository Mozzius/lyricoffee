import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { Collection, Song, SongDetails } from "types";
import sql, { makeSureSongTableExists } from "backend/db";
import { sessionOptions } from "utils/session";

export default withIronSessionApiRoute(allCollectionsRoute, sessionOptions);

async function allCollectionsRoute(
  req: NextApiRequest,
  res: NextApiResponse<SongDetails[] | Song | { message: string }>
) {
  const {
    query: { offset, limit },
    body: { name, artist, album, lyrics },
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
        const songsQuery = await sql<Song[]>`
          SELECT * FROM songs LIMIT ${limit} OFFSET ${offset}
        `;

        res.json(
          await Promise.all(
            songsQuery.map((song) =>
              (async () => ({
                ...song,
                collection: await sql<Collection[]>`
                  SELECT * FROM collection WHERE id = ${song.collection_id}
                `.then((x) => x[0]),
              }))()
            )
          )
        );
        break;
      case "POST":
        const { id: user_id } = userDetails();

        if (!name || !artist || !album || !lyrics)
          throw new Error("Invalid song");

        const [song] = await sql<Song[]>`
          INSERT INTO songs ${sql({ user_id, name, artist, album, lyrics })}
          RETURNING *
        `;

        res.json(song);
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
