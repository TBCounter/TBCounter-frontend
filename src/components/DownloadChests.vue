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
import { ref } from 'vue';

const dateSelection = ref(false);

const downloadDate = ref();

const timeSelectionFirst = ref(false);
const timeSelectionSecond = ref(false);

const downloadTimeFirst = ref();
const downloadTimeSecond = ref();
</script>

<style scoped lang="scss"></style>
