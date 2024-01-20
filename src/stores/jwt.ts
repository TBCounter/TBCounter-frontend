import { defineStore } from 'pinia';
import { authenticate } from '../api';
import { useUser } from './user';
import { useStorage } from '@vueuse/core';
import { Token } from '../types';
import { useQuasar } from 'quasar';

const $q = useQuasar();

export const useJWT = defineStore({
  id: 'jwt',
  state: () => ({
    jwt: useStorage('jwt', ''),
    restoreToken: useStorage('restoreToken', ''),
    isAuthenticated: false,
  }),
  getters: {
    token: (state) => state.jwt,
  },
  actions: {
    setJWT(newToken: Token | undefined) {
      this.jwt = newToken?.token || '';
      if (newToken?.token && $q) {
        $q.cookies.set('jwt', newToken?.token, {
          path: '/',
          expires: 182,
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        this.isAuthenticated = true;
      }
      if (!newToken?.token && $q) {
        this.isAuthenticated = false;
        $q.cookies.remove('jwt', {
          path: '/',
          domain: process.env.CLIENT ? window.location.hostname : undefined,
        });
        $q.cookies.remove('jwt', {
          path: '/',
        });
      }
    },
    async login(password: string, email: string) {
      try {
        const response = await authenticate({
          email,
          password,
        });
        this.setJWT(response.data);

        const user = useUser();
        await user.fillUserInfo();

        return response;
      } catch (error) {
        throw error;
      }
    },
    logout() {
      // it's better to use user logout
      this.setJWT(undefined);
    },
  },
});
