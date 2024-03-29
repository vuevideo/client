<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { CreateAccountDto } from '~/utils/modules/auth/dtos/create-account.dto';
import { registerNewAccount } from '~/utils/modules/auth/service';

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);

// Validation rules integration.
const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    name: yup
      .string()
      .min(5, 'Name must be atleast of 5 characters.')
      .required('Name is required.'),
    emailAddress: yup
      .string()
      .email('The given email address is invalid.')
      .required('Email Address is required.'),
    username: yup
      .string()
      .min(5, 'Username must be atleast of 5 characters.')
      .required('Username is required.'),
    password: yup
      .string()
      .min(5, 'Password must be atleast of 5 characters.')
      .required('Password is required.'),
    passwordAgain: yup
      .string()
      .min(5, 'Password must be atleast of 5 characters.')
      .required('Password is required.')
      .oneOf([yup.ref('password')], 'Passwords do not match.'),
  }),
});

// Fields to be used for validation
const name = useField('name');
const emailAddress = useField('emailAddress');
const username = useField('username');
const password = useField('password');
const passwordAgain = useField('passwordAgain');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  loading.value = true;

  const { data: userData, error: userError } = await registerNewAccount(
    CreateAccountDto.fromJson(values)
  );

  loading.value = false;

  if (userError?.isEmpty()) {
    navigateTo('/login');
  } else {
    error.value = userError!.message;
  }
});
</script>

<template>
  <v-container class="h-screen w-100 d-flex justify-center align-center">
    <v-sheet class="rounded elevation-24 pa-8">
      <v-container class="text-center text-h4"
        >Register for a new account ✨</v-container
      >
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column flex-md-row flex-row ma-0 pa-0">
          <v-container class="ma-0 pa-0">
            <v-text-field
              variant="outlined"
              class="mx-2 px-2 my-2 my-md-0 py-1 py-md-0 flex-grow-1 flex-shrink-1"
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
              label="Name"
              data-cy="name"
            />
          </v-container>
          <v-container class="ma-0 pa-0">
            <v-text-field
              variant="outlined"
              class="mx-2 px-2 my-2 my-md-0 py-1 py-md-0 flex-grow-1 flex-shrink-1"
              v-model="username.value.value"
              :error-messages="username.errorMessage.value"
              label="Username"
              data-cy="username"
            />
          </v-container>
        </v-container>
        <v-text-field
          variant="outlined"
          class="ma-2 pa-2"
          v-model="emailAddress.value.value"
          :error-messages="emailAddress.errorMessage.value"
          label="Email Address"
          data-cy="email"
        />
        <v-text-field
          variant="outlined"
          class="ma-2 pa-2"
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          label="Password"
          type="password"
          data-cy="password"
        />
        <v-text-field
          variant="outlined"
          class="ma-2 pa-2"
          v-model="passwordAgain.value.value"
          :error-messages="passwordAgain.errorMessage.value"
          label="Password Again"
          type="password"
          data-cy="passwordAgain"
        />
        <v-container class="d-flex align-center justify-center">
          <v-btn color="success" type="submit" data-cy="btn" :loading="loading"
            >Create New Account</v-btn
          >
        </v-container>
        <v-alert
          closable
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Registration Error"
          :text="error"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>
