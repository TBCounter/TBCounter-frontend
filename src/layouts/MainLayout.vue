<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-tabs>
          <q-tab
            name="chest"
            icon="diamond"
            label="Chests"
            @click="$router.push('/')"
          />
          <q-tab
            name="report"
            icon="flag"
            label="Report"
            @click="reportTab()"
          />
        </q-tabs>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="
            miniState = !miniState && drawer;
            drawer = true;
          "
        />

        <q-toolbar-title> Totalbattle counter </q-toolbar-title>

        <q-btn icon="logout" @click="userStore.logout()" dense>log out</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :mini="miniState"
      show-if-above
      bordered
      :width="200"
      :breakpoint="500"
    >
      <q-list>
        <q-item-label header> Your accounts: </q-item-label>
        <q-item
          clickable
          v-for="account in userStore.accounts"
          :key="account.id"
          v-ripple
          @click="
            $router.push({
              name: 'account',
              params: { id: account.id.toString() },
            })
          "
        >
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="API_URL + '/' + account.avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section :class="{ 'text-amber-9': account.vip }">
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

      <div class="column items-center q-mt-md q-gutter-sm">
        <q-btn
          color="white"
          icon="help_outline"
          @click="help = true"
          text-color="black"
          :label="helpLabel"
          :round="miniState"
        />

        <q-btn
          color="white"
          icon="error_outline"
          @click="changeLog = true"
          text-color="black"
          :label="miniState ? '' : 'Change log'"
          :round="miniState"
        />
      </div>
    </q-drawer>

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
    <q-dialog v-model="changeLog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Change Log</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-item v-for="log in changeLogs" :key="log">
            <q-item-section>
              <q-item-label>{{ log.Date }}</q-item-label>
              <q-item-label v-for="text in log.Text" :key="text" caption>
                {{ text }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Ok" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { loadChangeLog } from 'src/api';
import { ref, computed, watch, onMounted } from 'vue';
import { useUser } from '../stores/user';
import { API_URL } from '../api';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const help = ref(false);
const changeLog = ref(false);

const userStore = useUser();

const miniState = ref(false);

const drawer = ref(true);

const router = useRouter();
const route = useRoute();

const reportTab = () => {
  if (route.path !== '/') {
    router.push(route.path + '/report');
  }
};

const helpLabel = computed(() => {
  if (miniState.value) {
    return '';
  }
  return 'Help';
});

const changeLogs = ref();

onMounted(async () => {
  await loadChangeLog().then((response) => {
    changeLogs.value = response.data;
  });
  userStore.fillUserInfo();
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
