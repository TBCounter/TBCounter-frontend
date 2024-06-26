<template>
  <q-table
    v-for="level in rows"
    :key="level.level"
    dense
    :rows="level.data"
    :columns="allColumns"
    row-key="name"
    :rows-per-page-options="[0]"
    class="sticky-header sticky-row q-mt-md"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <template v-for="(col, index) in allColumns" :key="col.name">
          <q-th
            style="
              max-width: 15px;
              white-space: nowrap;
              overflow: visible;
              background: transparent;
              overflow-wrap: normal;
              white-space: normal;
            "
            :class="col.classes"
          >
            <div
              v-if="
                col.name?.split(/(\d+)/)[1] &&
                col.name?.split(/(\d+)/)[0] !==
                  allColumns[index - 1]?.name?.split(/(\d+)/)[0]
              "
              style="
                overflow: visible;
                white-space: normal;
                overflow-wrap: normal;
              "
            >
              {{ col.name?.split(/(\d+)/)[0] }}
            </div>
          </q-th>
        </template>
      </q-tr>
      <q-tr :props="props">
        <q-th
          style="background: white"
          :style="{ 'z-index:100': col.name === 'name' }"
          :key="col.name"
          v-for="col in allColumns"
        >
          <div v-if="col.name?.split(/(\d+)/)[1]">
            {{ col.name?.split(/(\d+)/)[1] }}
          </div>
          <div
            v-else
            style="transform: rotate(180deg); writing-mode: vertical-rl"
          >
            {{ col.name?.split(/(\d+)/)[0] }}
          </div>
        </q-th>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { getClanReport } from 'src/api';
import { computed } from 'vue';
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
  columns?: BackSchema[];
};

const allColumns = computed(() => {
  return [...columns.value]

    .reduce((accumulator: any[], currentValue: any) => {
      if (currentValue.columns) {
        const addColumn = currentValue.columns.map((el: any) => {
          return { ...el, name: el.field, classes: el.classes };
        });
        accumulator = [...accumulator, ...addColumn];
      } else {
        accumulator = [...accumulator, currentValue];
      }
      return accumulator;
    }, [])
    .sort((a, b) => {
      const nameA = a.name?.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name?.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
});

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
      // name: schema.title,
      label: schema.title,
      field: schema.field,
      required: schema.field === 'name',
      sortable: schema.field === 'name',
      classes: schema.cssClass,
      columns: schema.columns,
      align: 'right',
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
  thead tr th {
    /* bg color is important for th; just specify one */
    background-color: white;
  }

  thead tr th {
    position: sticky;
    z-index: 2;
  }
  thead tr th {
    top: 0;
    z-index: 5;
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

.report-table__column--name {
  background: red;
}

$colors: rgba(134, 163, 184, 0.2), rgba(232, 210, 166, 0.2),
  rgba(244, 132, 132, 0.2), rgba(194, 118, 100, 0.2), rgba(60, 125, 147, 0.2),
  rgba(168, 135, 36, 0.2), rgba(17, 33, 92, 0.2), rgba(199, 199, 172, 0.2),
  rgba(51, 13, 18, 0.2), rgba(60, 108, 63, 0.2), rgba(227, 199, 112, 0.2),
  rgba(63, 0, 113, 0.2), rgba(251, 37, 118, 0.2);

.report-table__column {
  @each $color in $colors {
    $i: index($colors, $color);

    &--index#{$i} {
      background-color: $color;

      & .tabulator-col {
        background-color: $color;
      }
    }
  }

  &--scores {
    background-color: rgba(154, 61, 154, 0.345);
  }

  &--sum {
    background-color: rgba(217, 217, 82, 0.263);
  }
}
</style>
