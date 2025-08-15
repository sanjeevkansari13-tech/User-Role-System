import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {

  const auth = useAuthStore();

  // If the user is not authenticated...
  if (!auth.isAuthenticated) {
    if (to.path !== '/login') {
      console.log('Redirecting to login: User not authenticated.');
      return navigateTo('/login');
    }
  } 
  // If the user IS authenticated...
  else {
    if (to.path === '/login') {
      console.log('Redirecting away from login: User already authenticated.');
      return navigateTo(auth.isAdmin ? '/admin' : `/users/${auth.user.id}`);
    }
  }
});