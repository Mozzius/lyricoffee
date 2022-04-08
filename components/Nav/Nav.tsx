import { useRouter } from "next/router";
import fetchApi from "utils/fetchApi";

import useAuth from "utils/useAuth";
import classes from "./Nav.module.scss";

export const Nav = () => {
  const { user, mutateUser } = useAuth();
  const router = useRouter();

  const login = () => router.push("/login");

  const register = () => router.push("/register");

  const logout = async () => {
    try {
      mutateUser(await fetchApi("/api/auth/logout"));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.inner}>
        <p>Lyricoffee!</p>
        <div className={classes.grow} />
        {user &&
          (user.isLoggedIn ? (
            <button onClick={logout}>Log out</button>
          ) : (
            <>
              <button onClick={login}>Log in</button>
              <button onClick={register}>Register</button>
            </>
          ))}
      </div>
    </nav>
  );
};

export default Nav;
