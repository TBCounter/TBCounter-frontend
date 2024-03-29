import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useJWT } from './jwt';
import { getAccounts } from 'src/api';
import { ref } from 'vue';
import { Account } from 'src/types';

export const useUser = defineStore('user', () => {
  const router = useRouter();
  const jwt = useJWT();

  const filledInfo = ref(false)
  const accounts = ref<Account[]>();

  async function logout() {
    jwt.logout();
    router.push('/login');
  }
  async function fillUserInfo() {
    await getAccounts().then((response) => {
      accounts.value = response.data;
      filledInfo.value = true;
    });
  }
  return { logout, fillUserInfo, accounts, filledInfo };
});
