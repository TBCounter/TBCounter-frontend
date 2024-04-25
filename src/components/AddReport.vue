<template>
  {{ newReport }}
  <q-btn icon="add" @click="dateSelection = true"
    ><q-tooltip> Add new report </q-tooltip></q-btn
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
          label="Add"
          color="primary"
          @click="addReport"
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
import { ref } from 'vue';

type Props = {
  id: number;
};

const emit = defineEmits(['newReport'])
const props = defineProps<Props>();

const dateSelection = ref(false);

const timeSelectionFirst = ref(false);
const timeSelectionSecond = ref(false);

const downloadTimeFirst = ref('00:00');
const downloadTimeSecond = ref('23:59');

const newReport = ref({});
const disableButton = ref(false);

const list = ref({ from: '', to: '' });

function addReport() {
  disableButton.value = true;
  const payload = {
    account_id: props.id,
    from: list.value.from,
    to: list.value.to,
    from_time: downloadTimeFirst.value,
    to_time: downloadTimeSecond.value,
  };
  disableButton.value = false;
  newReport.value = payload;
  emit('newReport', newReport)
}
</script>

<style scoped lang="scss"></style>
