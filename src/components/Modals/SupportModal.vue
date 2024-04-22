<template>
  <q-btn
    color="white"
    icon="favorite_outline"
    @click="support = true"
    text-color="black"
    :label="miniState ? '' : 'Support'"
    :round="miniState"
  />
  <q-dialog v-model="support">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Support me</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item class="q-mb-md">
            Financial support helps project to grow and to become more
            comfortable to use. Donating will give you "VIP" status, which
            allows you to open chests without any limitations.
          </q-item>
          <q-btn
            class="q-mr-sm"
            label="Support me on Patreon"
            color="primary"
            href="https://www.patreon.com/Omega394"
            target="_blank"
          />
          <q-btn
            label="Support me on Boosty"
            color="orange"
            href="https://boosty.to/omega_soft"
            target="_blank"
          />
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  miniState: boolean;
  modelValue: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const support = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<style scoped lang="scss"></style>
