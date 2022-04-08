import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "utils/session";
import { NextApiRequest, NextApiResponse } from "next";

import type { User, UserDetailsBE } from "types";
import sql from "backend/db";
import isEqual from "lodash/isEqual";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  let user = req.session.user;
  try {
    if (user && user.isLoggedIn) {
      const query = await sql<UserDetailsBE[]>`
        SELECT * FROM users WHERE id = ${user.details.id}
      `;

      if (query.length === 0) throw new Error("Could not find user");

      const { password: _, ...details } = query[0];

      if (!isEqual(details, user.details)) {
        user = {
          isLoggedIn: true,
          details: details,
        };
        req.session.user = user;
        req.session.save();
      }

      res.json(user);
    } else throw new Error("No session");
  } catch (err) {
    req.session.destroy();
    res.json({
      isLoggedIn: false,
      details: null,
    });
  }
}
