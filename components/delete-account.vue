<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { deleteAccount } from '~/utils/modules/user/service';
import * as yup from 'yup';

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);
const success = ref<boolean>(false);

// Validation rules integration.
const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    password: yup
      .string()
      .min(5, 'Password must be atleast of 5 characters.')
      .required('Password is required.'),
  }),
});

// Fields to be used for validation
const password = useField('password');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  // Set all loading indicators back to their default states.
  loading.value = true;
  success.value = false;
  error.value = '';

  // Delete account on server and firebase
  const { error: deleteError } = await deleteAccount(values.password);

  // Respond to the error
  if (deleteError?.isEmpty()) {
    success.value = true;
  } else {
    error.value = deleteError!.message;
  }

  // Turn off loading.
  loading.value = false;
});
</script>

<template>
  <v-container class="w-100 d-flex justify-center align-center">
    <v-sheet class="rounded elevation-24 pa-8">
      <v-container class="text-center text-h4">Delete Account ✨</v-container>
      <div>
        <p class="text-center">
          Please note that deleting your account deletes all of your data from
          <br />
          VueVideo.This action is irreversible and no data is recoverable after
          <br />
          deleting your account.
        </p>
      </div>
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column ma-0 pa-0">
          <v-text-field
            variant="outlined"
            class="ma-1 pa-1"
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Password"
            type="password"
            data-cy="password"
          />
          <v-container class="d-flex align-center justify-center">
            <v-btn
              color="success"
              type="submit"
              data-cy="delete-btn"
              :loading="loading"
              >Delete Account</v-btn
            >
          </v-container>
        </v-container>
        <v-alert
          closable
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Delete Account Error"
          :text="error"
        ></v-alert>
        <v-alert
          closable
          data-cy="success"
          v-if="success"
          type="success"
          title="Success"
          icon="$success"
          text="Your account has been deleted!"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>

