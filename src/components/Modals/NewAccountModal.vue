<template>
  <q-dialog :persistent="loading" v-model="dialog">
    <q-card style="min-width: 350px">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-h6">Add new account</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            outlined
            v-model="login"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
            autofocus
            :error="hasError"
            :error-message="'Login exists or somthing else went wrong'"
            label="login *"
          ></q-input>
          <q-input
            class="q-pt-xs"
            outlined
            v-model="name"
            label="name"
          ></q-input>
          <q-input
            class="q-pt-lg"
            outlined
            v-model="clan"
            label="clan"
          ></q-input>
          <q-toggle
            class="q-pt-lg"
            v-model="isTriumph"
            label="Triumph"
            disable
          />
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
import { setNewAccount } from 'src/api';
import { ref } from 'vue';
import { computed } from 'vue';

type Props = {
  modelValue: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'success']);

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
const isTriumph = ref(false);
const loading = ref(false);

const hasError = ref(false);

const onSubmit = async () => {
  loading.value = true;

  await setNewAccount({
    clan: clan.value,
    name: name.value,
    login: login.value,
    isTriumph: isTriumph.value,
  })
    .then(() => {
      emit('success');
      emit('update:modelValue', false);
    })
    .catch((e) => {
      hasError.value = true;

      console.log(e);
    });
  loading.value = false;
};
</script>

<style scoped lang="scss"></style>
