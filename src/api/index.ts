import axios, { AxiosResponse } from 'axios';

import { useUser } from '../stores/user';
import { useJWT } from '../stores/jwt';
import { Cookies } from 'quasar';
import { TimePickerType, Token } from 'src/types';

export const API_URL = process.env.API_URL;

export const WS_URL = process.env.WS_URL;

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use((request) => {
  if (request.url == '/login/') {
    return request;
  }
  const jwt = useJWT();
  if (request.headers && jwt.jwt) {
    request.headers.Authorization = `Bearer ${jwt.jwt}`;
  }
  const cookies = process.env.SERVER ? undefined : Cookies;
  if (cookies?.get('utm_source')) {
    request.headers['Utm-Source'] = cookies?.get('utm_source');
  }
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const user = useUser();
      user.logout();
    }
    return Promise.reject(error);
  }
);

export function authenticate(userData: { email: string; password: string }) {
  return axios.post('/login/', userData) as Promise<AxiosResponse<Token>>;
}

export function loadChangeLog() {
  return axios.get('/changelog/');
}

export function register(userData: { email: string; password: string }) {
  return axios.post('/register/', userData);
}

export function getReport(payload: any) {
  return axios.post('/report/', {
    ...payload,
  });
}

export function saveReport(payload: TimePickerType) {
  return axios.post('/save-report/', payload);
}

export function setNewAccount(payload: {
  login: string;
  password?: string;
  isTriumph: boolean;
  name: string;
  clan: string;
}) {
  return axios.post('/info/', payload);
}

export function setNewAccountSettings(payload: any) {
  return axios.patch('/info/', payload);
}

export function deleteAccount(payload: any) {
  return axios.delete('/info/', {
    data: {
      id: payload.id,
    },
  });
}
export function getMyLogin(id: any) {
  return axios.get('/my-login/?id=' + id);
}

export function getAccounts() {
  return axios.get('/info/');
}

export function getList(id: number, page: number, sort: string) {
  return axios.get('/list/', {
    params: { account_id: id, page, sort },
  });
}

export function getListFile(payload: TimePickerType) {
  return axios.post(
    '/list/',
    {
      ...payload,
    },
    { responseType: 'blob' }
  );
}

export function processChests(id: number) {
  return axios.post('/process/', { account_id: id });
}

export function killProcessChests(id: number) {
  return axios.post('/kill_process/', { account_id: id });
}

export function getClanReport(hash: string) {
  return axios.get(`/clan-report/?hash=${hash}`);
}

export function getClanPlayers(account_id: number) {
  return axios.get(`/clan-players/?account_id=${account_id}`);
}

export function deleteClanPlayers(
  account_id: number,
  player_id: number,
  with_chests: boolean
) {
  return axios.post('/clan-players-delete/', {
    account_id,
    player_id,
    with_chests,
  });
}

export function mergeClanPlayers(
  account_id: number,
  player_id: number,
  player_merge_id: number
) {
  return axios.post('/clan-players-merge/', {
    account_id,
    player_id,
    player_merge_id,
  });
}

export function changePlayerLevel(
  account_id: number,
  player_id: number,
  action: 'add' | 'remove'
) {
  return axios.post('/clan-players-level/', { account_id, player_id, action });
}

export function changePlayerName(
  account_id: number,
  player_id: number,
  name: string
) {
  return axios.post('/clan-players-edit/', { account_id, player_id, name });
}

export function getClanPlayersChestsCount(player_id: number) {
  return axios.get(`/clan-player-bounded-chests/?player_id=${player_id}`);
}

export function getScoresRulesList(account_id: number) {
  return axios.get(`/scores-rules/?account_id=${account_id}`);
}

export function saveScoresRulesList(account_id: number, rules: any) {
  return axios.post('/scores-rules/', { account_id, rules });
}

export function saveChestRequest(chest_id: number) {
  return axios.post('/save-chest/', { chest_id });
}

export function deleteChestRequest(chest_id: number) {
  return axios.post('/delete-chest/', { chest_id });
}

export function getChestTypes() {
  return axios.get('/chest-types/');
}

export function getChestNames() {
  return axios.get('/chest-names/');
}

export function getAccountStateImage(account_id: number) {
  return axios
    .get('/current_state/?account_id=' + account_id, {
      responseType: 'arraybuffer',
    })
    .then((response) =>
      Buffer.from(response.data, 'binary').toString('base64')
    );
}

export function getReportList(account_id: number) {
  return axios.get('/report-list/', { params: { account_id } });
}
