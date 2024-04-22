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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="from" :props="props">
            {{ props.row.from.toLocaleDateString('ru-RU') }}
            {{ props.row.fromTime }}
          </q-td>
          <q-td key="to" :props="props">
            {{ props.row.to.toLocaleDateString('ru-RU') }}
            {{ props.row.toTime }}
          </q-td>
          <q-td key="days" :props="props">
            {{
              getDays(
                props.row.to,
                props.row.toTime,
                props.row.from,
                props.row.fromTime
              )
            }}
          </q-td>
          <q-td key="link" :props="props">
            <a target="_blank" :href="generateLink(props.row.link)"> link</a>
          </q-td>
        </q-tr>
      </template>
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
  { label: 'To', field: 'to', name: 'to' },
  { label: 'Days', field: 'days', name: 'days' },
  { label: 'Link', field: 'link', name: 'link' },
];

const generateLink = (hash: string) => {
  return 'http://' + window.location.host + '/clan-report/' + hash;
};

const unpackedReportsList = computed(() => {
  return reportsList.value
    ?.map((el) => {
      const query = JSON.parse(el.query);
      return {
        from: new Date(query.from),
        fromTime: query.from_time,
        to: new Date(query.to),
        toTime: query.to_time,
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

function getDays(to: Date, toTime: string, from: Date, fromTime: string) {
  let toTimeGlobal = 0;
  let fromTimeGlobal = 0;
  if (to) {
    toTimeGlobal = to.getTime();
  }
  if (toTime) {
    const hours = toTime.split(':')[0];
    const minutes = toTime.split(':')[1];
    toTimeGlobal += parseInt(hours) * 60 * 60 * 1000;
    toTimeGlobal += parseInt(minutes) * 60 * 1000;
  }

  if (from) {
    fromTimeGlobal = from.getTime();
  }
  if (fromTime) {
    const hours = fromTime.split(':')[0];
    const minutes = fromTime.split(':')[1];
    fromTimeGlobal += parseInt(hours) * 60 * 60 * 1000;
    fromTimeGlobal += parseInt(minutes) * 60 * 1000;
  }
  // Math.round(
  //   (props.row.to.getTime() - props.row.from.getTime())
  // );

  const result = Math.round((toTimeGlobal - fromTimeGlobal) / (1000 * 60 * 60 * 24));
  if(!result){
    return 'inf'
  }
  return result
}
</script>
