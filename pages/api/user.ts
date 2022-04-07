import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "utils/session";
import { NextApiRequest, NextApiResponse } from "next";

import type { User } from "types";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  const user = req.session.user;
  if (user) {
    res.json(user);
  } else {
    res.json({
      isLoggedIn: false,
      details: null,
    });
  }
}
