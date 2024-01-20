import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useJWT } from './jwt';

export const useUser = defineStore('user', () => {
  const router = useRouter();
  const jwt = useJWT();

  async function logout() {
    jwt.logout();
    router.push('/login');
  }
  async function fillUserInfo() {
    return;
  }
  return { logout, fillUserInfo };
});
