<template>
  <q-page class="row items-center justify-evenly">
    <q-table
      class="table--sticky"
      style="height: calc(100vh - 100px)"
      title="Chests"
      virtual-scroll
      :rows="computedRows"
      :columns="columns"
      row-key="name"
      :loading="isLoading"
      :rows-per-page-options="[0]"
      :virtual-scroll-item-size="25"
      @virtual-scroll="onScroll"
      :dense="!$q.screen.lg"
      wrap-cells
      :grid="$q.screen.xs"
    >
      <template v-slot:top-right>
        <DownloadChests></DownloadChests>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch,computed } from 'vue';
import { useRoute } from 'vue-router';
import { WS_URL } from '../api';
import { Chest } from 'src/types';
import { Component } from 'vue';
import { onBeforeUnmount } from 'vue';
import DownloadChests from 'src/components/DownloadChests.vue';

const route = useRoute();
const wsConnection = ref<WebSocket>();

const isLoading = ref(true);

const nextPage = ref(1);
const lastPage = ref(0);

const columns = [
  { label: 'Имя', name: 'player', field: 'player' },
  { label: 'Сундук', field: 'chest_type', name: 'chest_type' },
  { label: 'Имя сундука', field: 'chest_name', name: 'chest_name' },
  { label: 'Время прихода', field: 'got_at', name: 'got_at' },
  { label: 'Время открытия', field: 'opened_in', name: 'opened_in' },
];

const rows = ref<Chest[]>([]);

const computedRows = computed(() => {
  return rows.value.map((el) => {
    const dateGotAt = new Date(el.got_at);
    const dateOpened = new Date(el.opened_in)
    el.got_at = dateGotAt.toLocaleString();
    el.opened_in = dateOpened.toLocaleString();
    return el;
  });
});

watch(
  () => route.params.id,
  (value) => {
    wsConnection.value?.close();
    updateChestsOpenWS();
  },
  { immediate: true }
);

async function onScroll(details: {
  index: number;
  from: number;
  to: number;
  direction: 'increase' | 'decrease';
  ref: Component;
}) {
  console.log(details);
  const lastIndex = rows.value.length - 1;
  if (
    isLoading.value !== true &&
    nextPage.value < lastPage.value &&
    details.to === lastIndex
  ) {
    isLoading.value = true;

    console.log(nextPage);
  }
  return;
}

async function updateChestsOpenWS() {
  wsConnection.value = new WebSocket(WS_URL + 'chests/' + route.params.id);
  wsConnection.value.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    console.log('message', data);
    rows.value = data.chests;
    isLoading.value = false;
    nextPage.value = data.page + 1;
    lastPage.value = data.total_pages;

    // if (!sorting.value && page.value == 1) {
    //   const data = JSON.parse(event.data);
    //   chests.value = data.chests;
    //   total.value = data.total;
    //   today.value = data.today_chests;
    //   await getAccountStateImage(acc.value!.id).then((response) => {
    //     if (statusImage.value && response) {
    //       statusImage.value = '';
    //     }
    //     statusImage.value = response;
    //   });
    // }
  };

  wsConnection.value.onopen = function (event) {
    console.log(event);
    // console.log("Successfully connected to the echo websocket server...")
  };
}

onBeforeUnmount(() => {
  wsConnection.value?.close();
});
</script>

<style lang="scss">
.table {
  &--sticky {
    thead tr th {
      position: sticky;
      z-index: 1;
      background-color: white;
    }
    thead tr:first-child th {
      top: 0;
    }
  }
}
</style>
