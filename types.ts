export type UserDetailsBE = {
  id: number;
  login: string;
  password: string;
  name: string;
  created_at: Date;
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

export type Collection = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
};

export type CollectionDetails = Collection & {
  songs: Song[];
};

export type Song = {
  id: number;
  name: string;
  artist: string;
  album: string;
  lyrics: string;
  collection_id: number;
  created_at: Date;
  updated_at: Date;
};

export type SongDetails = Song & {
  collection: Collection;
};
