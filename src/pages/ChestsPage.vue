<template>
  <q-page class="row items-center justify-evenly">
    <div class="column">
      <q-table
        class="table--sticky"
        title="Chests"
        style="min-height: 50vh"
        virtual-scroll
        :rows="computedRows"
        :columns="columns"
        row-key="id"
        :loading="isLoading"
        :rows-per-page-options="[25]"
        :dense="!$q.screen.lg"
        wrap-cells
        :grid="$q.screen.xs"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <template v-slot:top-right>
          <DownloadChests :id="+route.params.id"></DownloadChests>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="cursor-pointer"
            :class="{ 'bg-orange': props.row.check_needed }"
            @click="props.expand = !props.expand"
          >
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand" :props="props">
            <q-td colspan="100%">
              <img
                :src="
                  props.row.path.startsWith('H://TotalBattle/')
                    ? API_URL + '/' + props.row.path.substring(16)
                    : API_URL + '/' + props.row.path
                "
              />
              <img
                v-if="props.row.check_needed"
                :src="
                  props.row.check_needed.startsWith('H://TotalBattle/')
                    ? API_URL + '/' + props.row.check_needed.substring(16)
                    : API_URL + '/' + props.row.check_needed
                "
              />
              <q-btn @click="saveChest(props.row)" v-if="props.row.check_needed"
                >сохранить</q-btn
              >
              <q-btn
                @click="deleteChest(props.row)"
                v-if="props.row.check_needed"
                >удалить</q-btn
              >
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  WS_URL,
  API_URL,
  getList,
  saveChestRequest,
  deleteChestRequest,
} from '../api';
import { Chest } from 'src/types';
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

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});

const computedRows = computed(() => {
  return rows.value.map((el) => {
    const dateGotAt = new Date(el.got_at);
    const dateOpened = new Date(el.opened_in);
    el.got_at = dateGotAt.toLocaleString();
    el.opened_in = dateOpened.toLocaleString();
    return el;
  });
});

async function saveChest(item: Chest) {
  await saveChestRequest(item.id).then(() => {
    item.check_needed = false;
  });
}

async function deleteChest(item: Chest) {
  await deleteChestRequest(item.id).then(() => {
    // delete(item)
    rows.value = rows.value.filter((el) => {
      return el.id !== item.id;
    });
  });
}

watch(
  () => route.params.id,
  () => {
    wsConnection.value?.close();
    updateChestsOpenWS();
  },
  { immediate: true }
);

async function onRequest(dt: any) {
  if (isLoading.value !== true && nextPage.value < lastPage.value) {
    isLoading.value = true;

    console.log(pagination, 'pags');

    await getList(+route.params.id, dt.pagination.page, '-opened_in').then(
      (dt) => {
        const data = dt.data;
        pagination.value.page = data.page;
        pagination.value.rowsNumber = data.total;
        isLoading.value = false;
        rows.value = data.items;
      }
    );
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
    pagination.value.rowsNumber = data.total;
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
