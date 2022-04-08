import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "utils/session";
import { NextApiRequest, NextApiResponse } from "next";

import type { User } from "types";
import { createUser, makeSureUserTableExists } from "backend/db";

export default withIronSessionApiRoute(registerRoute, sessionOptions);

async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
  const { login, password, name } = req.body;

  try {
    await makeSureUserTableExists();

    // discard password!
    const { password: _, ...details } = await createUser(login, password, name);

    const user: User = { isLoggedIn: true, details };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
