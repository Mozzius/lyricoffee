export type UserDetailsBE = {
  id: number;
  login: string;
  password: string;
  name: string;
};

export type UserDetailsFE = Omit<UserDetailsBE, "password">;

export type User =
  | {
      isLoggedIn: true;
      details: UserDetailsFE;
    }
  | {
      isLoggedIn: false;
      details: null;
    };
