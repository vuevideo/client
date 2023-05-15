<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

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
const submit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <v-container class="h-screen w-100 d-flex justify-center align-center">
    <v-sheet class="w-50">
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-row ma-0 pa-0">
          <v-text-field
            variant="outlined"
            class="ma-2 pa-2"
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Name"
            data-cy="name"
          />
          <v-text-field
            variant="outlined"
            class="ma-2 pa-2"
            v-model="username.value.value"
            :error-messages="username.errorMessage.value"
            label="Username"
            data-cy="username"
          />
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
        <v-sheet class="w-100 d-flex align-center justify-center">
          <v-btn type="submit" data-cy="btn">Create New Account</v-btn>
        </v-sheet>
      </form>
    </v-sheet>
  </v-container>
</template>

