<script setup lang="ts">
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'custom',
});
</script>

<template>
  <h1>lol</h1>
  <v-btn to="/user/profile">User Page</v-btn>
</template>
