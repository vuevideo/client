<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { LoginAccountDto } from '~/utils/modules/auth/dtos/login-account.dto';
import { loginAccount } from '~/utils/modules/auth/service';

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);

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
});

// Fields to be used for validation
const emailAddress = useField('emailAddress');
const password = useField('password');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  loading.value = true;

  const { data: userData, error: userError } = await loginAccount(
    LoginAccountDto.fromJson(values)
  );

  loading.value = false;

  if (userError?.isEmpty()) {
    navigateTo('/authenticated');
  } else {
    error.value = userError!.message;
  }
});
</script>

<template>
  <v-container class="h-screen w-100 d-flex justify-center align-center">
    <v-sheet class="rounded elevation-24 pa-8">
      <v-container class="text-center text-h4"
        >Login to your account account ✨</v-container
      >
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column ma-0 pa-0">
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
          <v-container class="d-flex align-center justify-center">
            <v-btn
              color="success"
              type="submit"
              data-cy="btn"
              :loading="loading"
              >Log In</v-btn
            >
          </v-container>
        </v-container>
        <v-alert
          closable
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Login Error"
          :text="error"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>
