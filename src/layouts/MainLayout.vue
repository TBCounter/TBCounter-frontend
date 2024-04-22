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
          @click="
            miniState = !miniState && drawer;
            drawer = true;
          "
        />

        <q-toolbar-title>
          {{
            userStore.accounts?.find((el) => el.id === +route.params.id)
              ?.name || 'Totalbattle counter'
          }}</q-toolbar-title
        >

        <q-btn icon="logout" @click="userStore.logout()" dense>log out</q-btn>
      </q-toolbar>
      <q-tabs
        v-model="activeTab"
        v-if="['chests', 'report'].includes(route.name as string || '')"
      >
        <q-route-tab name="chests" icon="redeem" to="chests">
          <q-tooltip> Chests </q-tooltip></q-route-tab
        >
        <q-route-tab name="report" icon="summarize" to="report"
          ><q-tooltip> Reports </q-tooltip></q-route-tab
        >
      </q-tabs>
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
          :class="{
            'bg-blue-2': account.vip,
            'text-bold': account.id === +route.params.id,
          }"
          v-for="account in userStore.accounts"
          :key="account.id"
          v-ripple
          @click="
            $router.push({
              name: 'chests',
              params: { id: account.id.toString() },
            })
          "
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
        <q-item clickable @click="newAccount = true" v-ripple>
          <q-item-section avatar>
            <q-avatar>+</q-avatar>
          </q-item-section>
          <q-item-section>add new</q-item-section>
          <NewAccountModal @success="onSuccess" v-model="newAccount" />
        </q-item>
      </q-list>

      <div class="column items-center q-mt-md q-gutter-sm">
        <HelpModal v-model="help" :mini-state="miniState" />
        <ChangeLogModal :mini-state="miniState"></ChangeLogModal>
        <SupportModal v-model="support" :mini-state="miniState" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUser } from '../stores/user';
import { API_URL } from '../api';
import { useRoute } from 'vue-router';
import HelpModal from 'src/components/Modals/HelpModal.vue';
import ChangeLogModal from 'src/components/Modals/ChangeLogModal.vue';
import SupportModal from 'src/components/Modals/SupportModal.vue';
import NewAccountModal from 'src/components/Modals/NewAccountModal.vue';

const support = ref(false);

const userStore = useUser();

const miniState = ref(false);

const drawer = ref(true);

const route = useRoute();

const newAccount = ref(false);

const activeTab = computed({
  get() {
    return route.name?.toString() || '';
  },
  set() {
    return;
  },
});

onMounted(async () => {
  userStore.fillUserInfo();
});

const onSuccess = () => {
  userStore.fillUserInfo();
};

const help = ref(false);

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
