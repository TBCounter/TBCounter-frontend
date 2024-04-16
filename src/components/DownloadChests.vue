<template>
  {{ downloadDate }} {{ downloadTimeFirst }} {{ downloadTimeSecond }}
  <q-btn label="download chests" @click="dateSelection = true" />
  <q-dialog v-model="dateSelection">
    <q-date v-model="downloadDate" range>
      <div class="row items-center justify-end q-gutter-sm">
        <q-btn
          @click="timeSelectionFirst = true"
          class="order-first"
          icon="access_time"
          round
          color="primary"
        >
          <q-dialog v-model="timeSelectionFirst">
            <q-time v-model="downloadTimeFirst">
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
          </q-dialog>
          <q-dialog v-model="timeSelectionSecond">
            <q-time v-model="downloadTimeSecond">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat v-close-popup />
              </div>
            </q-time>
          </q-dialog>
        </q-btn>
        <q-btn label="Cancel" color="primary" flat v-close-popup />
        <q-btn label="Download" color="primary" flat v-close-popup />
      </div>
    </q-date>
  </q-dialog>
</template>

<script setup lang="ts">
import { getListFile } from 'src/api';
import { ref } from 'vue';

const dateSelection = ref(false);

const downloadDate = ref();

const timeSelectionFirst = ref(false);
const timeSelectionSecond = ref(false);

const downloadTimeFirst = ref('00:00');
const downloadTimeSecond = ref('23:59');

async function getListFileButton() {
  const payload = {
    account_id: acc.value!.id,
    from: listFrom.value,
    to: listTo.value,
    from_time: listFromTime.value,
    to_time: listToTime.value,
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
}
</script>

<style scoped lang="scss"></style>
