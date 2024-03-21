<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Totalbattle counter </q-toolbar-title>

        <q-btn icon="logout" @click="userStore.logout()" dense>log out</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Your accounts: </q-item-label>
        <q-item
          clickable
          v-for="account in userStore.accounts"
          :key="account.id"
        >
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="API_URL + '/' + account.avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ account.name }}
          </q-item-section>
        </q-item>
        <div v-if="!userStore.filledInfo">
          <q-item v-for="n in 10" :key="n">
            <q-item-section avatar>
              <q-skeleton height="40px" width="40px" type="rect"></q-skeleton>
            </q-item-section>
            <q-item-section>
              <q-skeleton full-width type="text"></q-skeleton>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
      <div class="row justify-center q-mt-md">
        <q-btn
          color="white"
          icon="help_outline"
          @click="help = true"
          text-color="black"
          label="Help"
        />
        <q-dialog v-model="help">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">How to use?</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <q-list bordered separator padding class="rounded-borders">
                <q-item> 1. Create an account </q-item>
                <q-item>
                  2. Add&nbsp;<a
                    target="_blank"
                    href="https://chromewebstore.google.com/detail/count-starter/bpinmpkjgndaaheogageogdkeilggieo?hl=ru"
                    >chrome extension</a
                  >&nbsp;to your browser
                </q-item>
                <q-item>
                  3. Open&nbsp;<a target="_blank" href="https://totalbattle.com"
                    >game</a
                  >, authorize, open extension and login
                </q-item>
                <q-item> 4. Choose account, click collect and start </q-item>
                <q-item> 5. Wait until you get kicked out of the game </q-item>
                <q-item>
                  6. You can watch how service works on the account page (last
                  screenshot and all chests will appear)
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>


        <q-btn class="q-ml-md"
          color="white"
          icon="error_outline"
          @click="changeLog = true"
          text-color="black"
          label="Change Log"
        />
        <q-dialog v-model="changeLog">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Change Log</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="q-ma-md">
                <q-scroll-area style="height: 200px; width: 500px">
                  <div v-for="log in changeLogs" :key="log" class="q-py-xs">
                    {{ log.Date }}
                    <q-item-label v-for="text in log.Text" :key="text" caption>
                      {{ text }}
                    </q-item-label>
                  </div>
                </q-scroll-area>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { loadChangeLog } from 'src/api';

import { onMounted } from 'vue';
import { ref, watch } from 'vue';
import { useUser } from '../stores/user';
import { API_URL } from '../api';

const help = ref(false);
const changeLog = ref(false);

const userStore = useUser();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const changeLogs = ref();

onMounted(async () => {
  await loadChangeLog().then((response) => {
    changeLogs.value = response.data;
  });
});

watch(
  () => userStore.filledInfo,
  (value) => {
    if (value && !userStore.accounts?.length) {
      help.value = true;
    }
  },
  {
    immediate: true,
  }
);
</script>
