<template>
  <q-btn
    color="white"
    icon="help_outline"
    @click="emit('update:modelValue', true)"
    text-color="black"
    :label="helpLabel"
    :round="miniState"
  />
  <q-dialog v-model="help">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">How to use?</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-list bordered separator padding class="rounded-borders">
          <q-item> 1. Create an account </q-item>
          <q-item>
            2. Add&nbsp;<a
              target="_blank"
              href="https://chromewebstore.google.com/detail/count-starter/bpinmpkjgndaaheogageogdkeilggieo?hl=ru"
              >chrome extension</a
            >&nbsp;to your browser
          </q-item>
          <q-item>
            3. Open&nbsp;<a target="_blank" href="https://totalbattle.com"
              >game</a
            >, authorize, open extension and login
          </q-item>
          <q-item> 4. Choose account, click collect and start </q-item>
          <q-item> 5. Wait until you get kicked out of the game </q-item>
          <q-item>
            6. You can watch how service works on the account page (last
            screenshot and all chests will appear)
          </q-item>
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
const helpLabel = computed(() => {
  if (props.miniState) {
    return '';
  }
  return 'Help';
});

const help = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<style scoped lang="scss"></style>
