<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import {
  updateEmailAddressOnFirebase,
  getUser,
} from '~/utils/modules/user/service';
import * as yup from 'yup';
import { UpdateEmailDto } from '~/utils/modules/user/dtos/update-email.dto';

// Logged in user reference.
const { user, set } = useUser();

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);
const success = ref<boolean>(false);

// Validation rules integration.
const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    emailAddress: yup
      .string()
      .email('The given email address is invalid.')
      .required('Email Address is required.'),
    password: yup
      .string()
      .min(5, 'Password must be atleast of 5 characters.')
      .required('Password is required.'),
  }),
  initialValues: {
    emailAddress: user.value?.emailAddress,
    password: '',
  },
});

// Fields to be used for validation
const emailAddress = useField('emailAddress');
const password = useField('password');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  // Set all loading indicators back to their default states.
  loading.value = true;
  success.value = false;
  error.value = '';

  // Update user email address on the server.
  const { data: updateData, error: updateError } =
    await updateEmailAddressOnFirebase(
      values.password,
      UpdateEmailDto.fromJson(values)
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
      <v-container class="text-center text-h4"
        >Update Email Address ✨</v-container
      >
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column ma-0 pa-0">
          <v-text-field
            variant="outlined"
            class="ma-1 pa-1"
            v-model="emailAddress.value.value"
            :error-messages="emailAddress.errorMessage.value"
            label="Email Address"
            data-cy="email"
          />
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
              data-cy="submit-email-btn"
              :loading="loading"
              >Update Email Address</v-btn
            >
          </v-container>
        </v-container>
        <v-alert
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Email Address Update Error"
          :text="error"
        ></v-alert>
        <v-alert
          data-cy="success"
          v-if="success"
          type="success"
          title="Success"
          icon="$success"
          text="Email Address update was a success!"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>

