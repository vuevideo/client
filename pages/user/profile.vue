<script setup lang="ts">
// Middleware for Authentication and layout options
definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'custom',
});

// State for the tab
const tab = ref<number>(1);
</script>

<template>
  <v-card>
    <v-container class="text-center text-h4 my-12"
      >Update Your Account Details ✨</v-container
    >
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
      <v-tab :value="1" data-cy="update-profile">Update Account Profile</v-tab>
      <v-tab :value="2" data-cy="update-email">Update Email Address</v-tab>
      <v-tab :value="3" data-cy="update-password">Update Password</v-tab>
      <v-tab :value="4" data-cy="delete-account">Delete Account</v-tab>
    </v-tabs>
  </v-card>
  <v-window v-model="tab">
    <v-window-item :key="1" :value="1">
      <update-profile />
    </v-window-item>
  </v-window>
</template>

