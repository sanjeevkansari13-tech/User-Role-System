<template>
  <v-container>
    <div class="mb-8">
      <h1 class="text-h4 d-flex align-center">
        <v-icon icon="mdi-shield-account" class="mr-3"></v-icon>
        Admin Dashboard
      </h1>
      <p class="text-grey-darken-1 mt-1">
        Welcome, {{ auth.user?.name }}. Use this panel to manage and view user activity.
      </p>
    </div>

    <v-card class="mx-auto" max-width="600" flat border>
      <v-card-title class="d-flex align-center text-h6">
        <v-icon icon="mdi-account-switch" class="mr-2"></v-icon>
        User Impersonation
      </v-card-title>
      <v-card-subtitle>
        Select a user to view their dashboard and notes.
      </v-card-subtitle>
      <v-card-text>
        <v-select
          v-model="selectedUserId"
          :items="auth.regularUsers"
          item-title="name"
          item-value="id"
          label="Select a User"
          variant="outlined"
          prepend-inner-icon="mdi-account-search"
          clearable
          class="mt-4"
        ></v-select>

        <v-btn
          :disabled="!selectedUserId"
          :loading="loading"
          @click="impersonateUser"
          color="primary"
          block
          size="large"
          class="mt-4"
        >
          View User Dashboard
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: 'admin-auth'
});

const auth = useAuthStore();
const router = useRouter();

const selectedUserId = ref(null);
const loading = ref(false);

/**
 * Handles the impersonation logic.
 * 1. Calls the Pinia action to set the impersonation state.
 * 2. Navigates to the selected user's dashboard.
 */
const impersonateUser = () => {
  if (!selectedUserId.value) {
    return;
  }

  loading.value = true;

  // Set the impersonation user in the auth store
  auth.impersonate(selectedUserId.value);

  // Navigate to the user's dynamic page
  router.push(`/users/${selectedUserId.value}`);
  
  // No need to set loading to false as we are navigating away.
};
</script>

<style scoped>
.v-container {
  padding-top: 2rem;
}
</style>