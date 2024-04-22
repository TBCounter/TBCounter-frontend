<template>
  <q-page class="row items-center justify-evenly">
    <q-table
      :rows="unpackedReportsList"
      :columns="columns"
      row-key="hash"
      class="table--sticky"
      title="Reports"
      style="min-height: 50vh"
      :rows-per-page-options="[10]"
    >
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { getReportList } from 'src/api';
import { computed } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

type ReportList = { hash: string; query: string };

const reportsList = ref<ReportList[]>();

const columns = [
  { label: 'From', name: 'from', field: 'from' },
  { label: 'To', field: 'to', name: 'To' },
  { label: 'Link', field: 'link', name: 'Link' },
];

const unpackedReportsList = computed(() => {
  return reportsList.value
    ?.map((el) => {
      const query = JSON.parse(el.query);
      return {
        from: query.from + ' ' + query.from_time,
        to: query.to + ' ' + query.to_time,
        link: el.hash,
      };
    })
    .reverse();
});

onMounted(async () => {
  await getReportList(parseInt(route.params.id as string)).then((response) => {
    reportsList.value = response.data;
  });
});
</script>
