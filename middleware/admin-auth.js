import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (!auth.isAuthenticated) {
    // If not, redirect to the login page.
    console.log('Redirecting to login: User not authenticated.');
    return navigateTo('/login');
  }

  if (!auth.isAdmin) {
    // If they are a regular user, redirect them to their own dashboard.
    console.log('Redirecting to user page:');
    return navigateTo(`/users/${auth.user.id}`);
  }
  
  // If both checks pass, the user is an admin. Allow access.
  console.log('Admin access granted.');
});