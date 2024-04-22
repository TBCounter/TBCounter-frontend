<template>
  <q-dialog :persistent="loading" v-model="dialog">
    <q-card style="min-width: 350px">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-h6">Add new account</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input outlined v-model="login" autofocus label="login"></q-input>
          <q-input
            class="q-pt-sm"
            outlined
            v-model="name"
            label="name"
          ></q-input>
          <q-input
            class="q-pt-sm"
            outlined
            v-model="clan"
            label="clan"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn :disable="loading" flat label="Cancel" v-close-popup />
          <q-btn :disable="loading" flat type="submit" label="Add account" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';

type Props = {
  modelValue: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const login = ref('');
const clan = ref('');
const name = ref('');

const loading = ref(false);

const onSubmit = () => {
  loading.value = true;
  login.value = '';
  clan.value = '';
  name.value = '';
};
</script>

<style scoped lang="scss"></style>
