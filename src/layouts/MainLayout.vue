<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Totalbattle counter
        </q-toolbar-title>

        <q-btn icon="logout" @click="userStore.logout()" dense>log out</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Your accounts:
        </q-item-label>
        <q-item clickable v-for="account in userStore.accounts" :key="account.id">
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="API_URL + '/' + account.avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>

            {{ account.name }}
          </q-item-section>
        </q-item>



      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '../stores/user'
import { API_URL } from '../api'

const userStore = useUser()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
