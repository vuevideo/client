<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { updateUserPassword, getUser } from '~/utils/modules/user/service';
import * as yup from 'yup';
import { updatePassword } from 'firebase/auth';

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);
const success = ref<boolean>(false);

// Logged in user reference.
const { set } = useUser();

// Validation rules integration.
const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    oldPassword: yup
      .string()
      .min(5, 'Password must be atleast of 5 characters.')
      .required('Password is required.'),
    newPassword: yup
      .string()
      .min(5, 'New Password must be atleast of 5 characters.')
      .required('Password is required.'),
    newPasswordAgain: yup
      .string()
      .min(5, 'New Password must be atleast of 5 characters.')
      .required('Password is required.')
      .oneOf([yup.ref('newPassword')], 'Passwords do not match.'),
  }),
});

// Fields to be used for validation
const oldPassword = useField('oldPassword');
const newPassword = useField('newPassword');
const newPasswordAgain = useField('newPasswordAgain');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  // Set all loading indicators back to their default states.
  loading.value = true;
  success.value = false;
  error.value = '';

  // Update user email address on the server.
  const { data: updateData, error: updateError } = await updateUserPassword(
    values.oldPassword,
    values.newPassword
  );

  // If error is empty, update global user state.
  if (updateError?.isEmpty()) {
    const serverUser = await getUser();
    set(serverUser.data!);

    success.value = true;
  } else {
    error.value = updateError!.message;
  }

  // Turn off loading.
  loading.value = false;
});
</script>

<template>
  <v-container class="w-100 d-flex justify-center align-center">
    <v-sheet class="rounded elevation-24 pa-8">
      <v-container class="text-center text-h4">Update Password ✨</v-container>
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column ma-0 pa-0">
          <v-text-field
            variant="outlined"
            class="ma-2 pa-2"
            v-model="oldPassword.value.value"
            :error-messages="oldPassword.errorMessage.value"
            label="Old Password"
            type="password"
            data-cy="old-password"
          />
          <v-text-field
            variant="outlined"
            class="ma-2 pa-2"
            v-model="newPassword.value.value"
            :error-messages="newPassword.errorMessage.value"
            label="New Password"
            type="password"
            data-cy="new-password"
          />
          <v-text-field
            variant="outlined"
            class="ma-2 pa-2"
            v-model="newPasswordAgain.value.value"
            :error-messages="newPasswordAgain.errorMessage.value"
            label="New Password Again"
            type="password"
            data-cy="new-password-again"
          />
          <v-container class="d-flex align-center justify-center">
            <v-btn
              color="success"
              type="submit"
              data-cy="submit-password-btn"
              :loading="loading"
              >Update Password</v-btn
            >
          </v-container>
        </v-container>
        <v-alert
          closable
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Password Update Error"
          :text="error"
        ></v-alert>
        <v-alert
          closable
          data-cy="success"
          v-if="success"
          type="success"
          title="Success"
          icon="$success"
          text="Password update was a success!"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>
