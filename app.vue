<script setup lang="ts">
import { useServerFetch } from '~/composables/useServerFetch';

const { data } = await useServerFetch<string>('/api/v1/hello', {
  server: true,
  method: 'GET',
});

const buttonClick = async () => {
  const { data } = await useFetch('/api/v1/hello', {
    server: false,
    method: 'GET',
  });

  console.log(data.value);
};
</script>

<template>
  <div>
    {{ data }}
    <button @click="buttonClick">click me</button>
  </div>
</template>
