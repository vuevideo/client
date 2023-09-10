<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { updateUser, getUser } from '~/utils/modules/user/service';
import * as yup from 'yup';
import { UpdateUserDto } from '~/utils/modules/user/dtos/update-user.dto';

// Template ref for upload button
const uploadBtnRef = ref();

// Logged in user reference.
const { user, set } = useUser();

// Server States.
const error = ref<string>('');
const loading = ref<boolean>(false);
const success = ref<boolean>(false);

// Validation rules integration.
const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    name: yup
      .string()
      .min(5, 'Name must be atleast of 5 characters.')
      .required('Name is required.'),
    username: yup
      .string()
      .min(5, 'Username must be atleast of 5 characters.')
      .required('Username is required.'),
  }),
  initialValues: {
    name: user.value?.account.name,
    username: user.value?.account.username,
  },
});

// Fields to be used for validation
const name = useField('name');
const username = useField('username');

// Form Submit Action.
const submit = handleSubmit(async (values) => {
  // Set all loading indicators back to their default states.
  loading.value = true;
  success.value = false;
  error.value = '';

  // Update use profile on the server.
  const { data: updateData, error: updateError } = await updateUser(
    UpdateUserDto.fromJson(values)
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

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;

  if (target && target.files) {
    console.log(target.files);
  }
};
</script>

<template>
  <v-container class="w-100 d-flex justify-center align-center">
    <v-sheet class="rounded elevation-24 pa-8">
      <v-container class="text-center text-h4"
        >Update Account Profile ✨</v-container
      >
      <v-container class="d-flex flex-column justify-center align-center">
        <v-avatar :image="user?.account.image.imageLink" size="40%" />
        <v-file-input
          ref="uploadBtnRef"
          label="File input"
          class="d-none"
          @change="onFileChanged($event)"
          accept="image/*"
          capture
        />
        <v-btn
          color="success"
          type="submit"
          data-cy="pic-btn"
          class="my-5"
          @click="
            () => {
              uploadBtnRef.click();
            }
          "
          >Upload Image</v-btn
        >
      </v-container>
      <form @submit.prevent="submit">
        <v-container class="d-flex flex-column ma-0 pa-0">
          <v-text-field
            variant="outlined"
            class="ma-1 pa-1"
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Name"
            data-cy="name"
          />
          <v-text-field
            variant="outlined"
            class="ma-1 pa-1"
            v-model="username.value.value"
            :error-messages="username.errorMessage.value"
            label="Username"
            data-cy="username"
          />
          <v-container class="d-flex align-center justify-center">
            <v-btn
              color="success"
              type="submit"
              data-cy="submit-btn"
              :loading="loading"
              >Update Profile</v-btn
            >
          </v-container>
        </v-container>
        <v-alert
          data-cy="error"
          v-if="error !== ''"
          color="error"
          icon="$error"
          title="Profile Update Error"
          :text="error"
        ></v-alert>
        <v-alert
          data-cy="success"
          v-if="success"
          type="success"
          title="Success"
          icon="$success"
          text="Profile update was a success!"
        ></v-alert>
      </form>
    </v-sheet>
  </v-container>
</template>

