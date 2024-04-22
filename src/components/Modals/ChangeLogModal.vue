<template>
  <q-btn
    color="white"
    icon="error_outline"
    @click="changeLog = true"
    text-color="black"
    :label="miniState ? '' : 'Change log'"
    :round="miniState"
  />
  <q-dialog v-model="changeLog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Change Log</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-item v-for="log in changeLogs" :key="log">
          <q-item-section>
            <q-item-label>{{ log.Date }}</q-item-label>
            <q-item-label v-for="text in log.Text" :key="text" caption>
              {{ text }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Ok" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loadChangeLog } from 'src/api';
import { onMounted } from 'vue';

type Props = {
  miniState: boolean;
};

defineProps<Props>();

const changeLog = ref(false);
const changeLogs = ref();

onMounted(async () => {
  await loadChangeLog().then((response) => {
    changeLogs.value = response.data;
  });
});
</script>

<style scoped lang="scss"></style>
