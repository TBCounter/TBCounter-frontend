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

export type Chest = {
  check_needed: null | boolean;
  chest_name: string;
  chest_type: string;
  got_at: string;
  id: number;
  opened_in: string;
  path: string;
  player: string;
};
