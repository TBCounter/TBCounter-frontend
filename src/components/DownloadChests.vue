<template>
  <q-btn icon="download" @click="dateSelection = true"
    ><q-tooltip> Download chests </q-tooltip></q-btn
  >
  <q-dialog v-model="dateSelection">
    <q-date v-model="list" range mask="YYYY-MM-DD">
      <div class="row items-center justify-end q-gutter-sm">
        <q-btn
          @click="timeSelectionFirst = true"
          class="order-first"
          icon="access_time"
          round
          color="primary"
        >
          <q-tooltip> Adjust time </q-tooltip>
        </q-btn>
        <q-btn label="Cancel" color="primary" flat v-close-popup />
        <q-btn
          label="Download"
          color="primary"
          @click="getListFileButton"
          :disable="disableButton"
          flat
        />
      </div>
    </q-date>
  </q-dialog>
  <q-dialog v-model="timeSelectionFirst">
    <q-card>
      <q-card-section>
        <div class="text-h6">From</div>
      </q-card-section>
      <q-time format24h v-model="downloadTimeFirst">
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat v-close-popup />
          <q-btn
            label="OK"
            color="primary"
            flat
            @click="timeSelectionSecond = true"
            v-close-popup
          />
        </div>
      </q-time>
    </q-card>
  </q-dialog>
  <q-dialog v-model="timeSelectionSecond">
    <q-card>
      <q-card-section>
        <div class="text-h6">To</div>
      </q-card-section>
      <q-time format24h v-model="downloadTimeSecond">
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat v-close-popup />
          <q-btn label="OK" color="primary" flat v-close-popup />
        </div>
      </q-time>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { getListFile } from 'src/api';
import { ref } from 'vue';

type Props = {
  id: number;
};

const props = defineProps<Props>();

const dateSelection = ref(false);

const timeSelectionFirst = ref(false);
const timeSelectionSecond = ref(false);

const downloadTimeFirst = ref('00:00');
const downloadTimeSecond = ref('23:59');

const disableButton = ref(false);

const list = ref({ from: '', to: '' });

async function getListFileButton() {
  disableButton.value = true;
  const payload = {
    account_id: props.id,
    from: list.value.from,
    to: list.value.to,
    from_time: downloadTimeFirst.value,
    to_time: downloadTimeSecond.value,
  };
  const response = await getListFile(payload);
  const file = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = file;

  link.setAttribute(
    'download',
    `report_${payload.account_id}_${payload.from}_${payload.to}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
  disableButton.value = false;
}
</script>

<style scoped lang="scss"></style>
