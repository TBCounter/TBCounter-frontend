<template>
  <q-table
    v-for="level in rows"
    :key="level.level"
    dense
    :rows="level.data"
    :columns="columns"
    row-key="name"
    virtual-scroll
    :rows-per-page-options="[0]"
    class="sticky-header sticky-row"
  ></q-table>
</template>

<script setup lang="ts">
import { getClanReport } from 'src/api';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const hash = route.params.hash as string;

const columns = ref();

const rows = ref();

const from = ref();
const to = ref();

const lastChest = ref();

type BackSchema = {
  cssClass: string;
  field: string;
  frozen: boolean;
  headerFilter: string;
  title: string;
};

onMounted(async () => {
  const response = await getClanReport(hash);
  rows.value = response.data.result.map((table: any) => ({
    data: JSON.parse(table.data).data,
    level: table.level,
  }));
  console.log(rows.value[0].data);
  columns.value = response.data.schema.map((schema: BackSchema) => {
    return {
      name: schema.field,
      label: schema.title,
      field: schema.field,
      required: schema.field === 'name',
      sortable: true,
      classes: schema.cssClass,
    };
  });
  console.log(columns.value);
  from.value = response.data.from;
  to.value = response.data.to;
  lastChest.value = response.data.last;
});
</script>

<style lang="scss">
.sticky-header {
  height: 500px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: white;
  }

  thead tr th {
    position: sticky;
    z-index: 2;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 2;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}

.sticky-row {
  max-width: 100%;

  thead tr:first-child th:first-child {
    background-color: white;
  }

  td:first-child {
    background-color: white;
  }

  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>
