<template>
  <q-btn label="download chests" @click="selectFromTime = true"> </q-btn>
  <q-dialog v-model="selectToTime">
    <q-time v-model="secondTimeSelection">
      <div class="row items-center justify-end q-gutter-sm">
        <q-btn label="cancel" color="primary" flat v-close-popup />
        <q-btn label="download" color="primary" flat v-close-popup />
      </div>
    </q-time>
  </q-dialog>
  <q-dialog v-model="selectFromTime">
    <q-time v-model="firstTimeSelection">
      <div class="row items-center justify-end q-gutter-sm">
        <q-btn label="cancel" color="primary" flat v-close-popup />
        <q-btn
          label="ok"
          color="primary"
          flat
          v-close-popup
          @click="selectToTime = true"
        />
      </div>
    </q-time>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectFromTime = ref(false);
const selectToTime = ref(false);

const firstTimeSelection = ref();
const secondTimeSelection = ref();
</script>

<style scoped lang="scss"></style>
