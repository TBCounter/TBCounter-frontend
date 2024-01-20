<template>
  <q-page class="row items-center justify-evenly">
    Index
  </q-page>
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user';
import { onMounted } from 'vue';

const userStore = useUser();

onMounted(()=>{
  userStore.fillUserInfo()
})

</script>
