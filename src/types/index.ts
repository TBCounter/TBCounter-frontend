export type Token = {
  userName: string;
  token: string;
  userID: number;
};

export type Account = {
  name: string;
  clan: string;
  id: number;
  is_locked: boolean;
  avatar: string;
  chest_count: number;
  unavailable: boolean;
  vip: boolean;
};
