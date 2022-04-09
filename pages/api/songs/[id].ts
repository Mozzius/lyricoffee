import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "utils/session";
import { Collection, Song, SongDetails } from "types";
import sql, { makeSureSongTableExists } from "backend/db";

export default withIronSessionApiRoute(collectionRoute, sessionOptions);

async function collectionRoute(
  req: NextApiRequest,
  res: NextApiResponse<SongDetails | Song | { message: string }>
) {
  const {
    query: { id },
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
        const songQuery = await sql<Song[]>`
          SELECT * FROM songs WHERE id = ${id}
        `;

        if (songQuery.length === 0) throw new Error("Could not find song");

        res.json({
          ...songQuery[0],
          collection: await sql<Collection[]>`
            SELECT * FROM collections WHERE id = ${songQuery[0].collection_id}
          `.then((x) => x[0]),
        });
        break;
      case "PUT":
        const { id: userId } = userDetails();
        const songQuery2 = await sql<Song[]>`
          SELECT songs.* FROM songs
          JOIN collections ON collections.id = ${id}
          WHERE songs.id = ${id}
          AND collections.user_id = ${userId}
        `;

        if (songQuery2.length === 0) throw new Error("Could not find song");

        const [updated] = await sql<Song[]>`
          UPDATE songs SET
            name = ${name},
            artist = ${artist},
            album = ${album},
            lyrics = ${lyrics},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;

        res.json(updated);
        break;
      case "DELETE":
        const { id: userId2 } = userDetails();
        const collectionQuery3 = await sql<(Song & { user_id: number })[]>`
          SELECT songs.*, collection.user_id FROM songs
          JOIN collections ON collections.id = songs.collection_id
          WHERE id = ${id}
        `;

        if (collectionQuery3.length === 0)
          throw new Error("Could not find song");

        if (collectionQuery3[0].user_id !== userId2)
          throw new Error("You are not the owner of this song");

        await sql`
          DELETE FROM song WHERE id = ${id}
        `;

        res.send({ message: "Song deleted" });
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
