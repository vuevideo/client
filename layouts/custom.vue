<script setup lang="ts">
const { loading } = useUser();
</script>

<template>
  <slot v-if="!loading" />
  <loader v-if="loading" />
</template>

