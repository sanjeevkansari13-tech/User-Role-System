<template>
  <v-container class="fill-height" fluid>
    <v-row  justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login to Your Account</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <p class="subheading text-center grey--text text--darken-1 mb-6">
              Enter your credentials to continue
            </p>
            <v-form @submit.prevent="handleLogin">
              <!-- Email Input -->
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                required
                autofocus
              ></v-text-field>

              <!-- Password Input -->
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="[rules.required]"
                required
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>

              <!-- Error Message Display -->
              <v-alert
                v-if="errorMessage"
                type="error"
                density="compact"
                class="mb-4"
                variant="tonal"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- Login Button -->
              <v-btn
                :loading="loading"
                :disabled="!isFormValid"
                type="submit"
                color="primary"
                block
                size="large"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center mb-4">
            <div class="grey--text">
              Don't have an account?
              <a href="#" class="text-primary">Sign Up</a>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

// Component State
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref(null)

// Pinia Store and Vue Router
const authStore = useAuthStore()
const router = useRouter()

// Validation Rules
const rules = {
  required: value => !!value || 'Required.',
  email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
}

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  return rules.required(email.value) === true &&
         rules.email(email.value) === true &&
         rules.required(password.value) === true
})

// Login Handler
const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errorMessage.value = null

  try {
    // Attempt to log in using the email provided
    const user = await authStore.login(email.value)

    // Redirect based on user role
    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push(`/users/${user.id}`)
    }
  } catch (error) {
    // Display error message if login fails
    errorMessage.value = 'Invalid email or password. Please try again.'
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}

// Define the layout for this page
definePageMeta({
  layout: 'auth-layout', // Assuming you might have a different layout for auth pages
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background-color: #f5f5f5; /* Light grey background for the page */
}
.subheading {
  font-size: 1rem;
}
.text-primary {
  color: #1976D2; /* Vuetify's primary color */
  text-decoration: none;
}
.text-primary:hover {
  text-decoration: underline;
}
</style>