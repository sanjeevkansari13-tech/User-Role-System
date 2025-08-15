import { defineStore } from 'pinia'

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: 2, name: 'Alice', email: 'alice@example.com', role: 'user' },
  { id: 3, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 4, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // The authenticated user
    impersonatingUser: null, // The user being impersonated by an admin
  }),

  getters: {
    currentUser: (state) => state.impersonatingUser || state.user,

    // Checks if a user is logged in.
    isAuthenticated: (state) => !!state.user,

    // Checks if the logged-in user has the 'admin' role.
    isAdmin: (state) => state.user?.role === 'admin',

    // Checks if an admin is currently impersonating another user.
    isImpersonating: (state) => !!state.impersonatingUser,

    // List of regular users 
    regularUsers: () => mockUsers.filter(u => u.role === 'user'),
  },

  actions: {
    /**
     * Logs in a user.
     * In a real-world app, this would involve an API call to authenticate credentials.
     * Here, we simulate it by finding a user in our mock data.
     * @param {string} email - The user's email.
     */
    login(email) {
      return new Promise((resolve, reject) => {
        const foundUser = mockUsers.find(u => u.email === email)
        if (foundUser) {
          this.user = foundUser
          resolve(foundUser)
        } else {
          reject('User not found')
        }
      })
    },

    /**
     * Logs out the current user and clears any impersonation state.
     */
    logout() {
      this.user = null
      this.impersonatingUser = null
    },

    /**
     * Allows an admin to start impersonating a regular user.
     * @param {number} userId - The ID of the user to impersonate.
     */
    impersonate(userId) {
      if (this.isAdmin) {
        const userToImpersonate = mockUsers.find(u => u.id === userId)
        if (userToImpersonate && userToImpersonate.role !== 'admin') {
          this.impersonatingUser = userToImpersonate
        } else {
          console.error('User not found or cannot impersonate an admin.');
        }
      } else {
        console.error('Only admins can impersonate users.');
      }
    },

    /**
     * Stops the impersonation and returns the admin to their own context.
     */
    stopImpersonating() {
      this.impersonatingUser = null
    },
  },
  persist: true,
})