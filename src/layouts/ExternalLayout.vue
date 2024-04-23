<template>
  <q-layout view="lhh Lpr lFf">
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Changelog:
          <q-btn
            flat
            dense
            round
            icon="close"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
            class="float-right"
        /></q-item-label>
        <q-item v-for="log in changeLogs" :key="log" clickable>
          <q-item-section>
            <q-item-label>{{ log.Date }}</q-item-label>
            <q-item-label v-for="text in log.Text" :key="text" caption>
              {{ text }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <div v-if="!changeLogs?.length">
          <q-item v-for="n in 10" :key="n">
            <q-skeleton width="100%" height="200px" type="rect" />
          </q-item>
        </div>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { loadChangeLog } from 'src/api';
import { ref } from 'vue';
import { onMounted } from 'vue';

const leftDrawerOpen = ref(false);

const changeLogs = ref();

onMounted(async () => {
  await loadChangeLog().then((response) => {
    changeLogs.value = response.data;
  });
});
</script>
<style scoped lang="scss"></style>
