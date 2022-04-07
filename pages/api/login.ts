import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "utils/session";
import { NextApiRequest, NextApiResponse } from "next";

import type { User } from "types";
import { getUserWithLoginAndPassword } from "backend/db";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { login, password } = req.body;

  try {
    // discard password!
    const { password: _, ...details } = await getUserWithLoginAndPassword(
      login,
      password
    );

    const user: User = { isLoggedIn: true, details };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
