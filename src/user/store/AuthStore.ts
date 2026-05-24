import { defineStore } from 'pinia'
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth'
import logger from '../logger'

export const AuthStore = defineStore('auth', {
  state: () => ({
    IsLoggedIn: false,
    Cognito: {} as { username?: string; userId?: string },
  }),
  actions: {
    async setCognito(): Promise<void> {
      try {
        this.Cognito = await getCurrentUser()
        await fetchAuthSession()
        this.IsLoggedIn = true
      } catch (e) {
        logger.warn(`User not logged in or cannot autologin`)
        this.IsLoggedIn = false
      }
    },
    signOut(): void {
      if (this.Cognito.userId) {
        localStorage.removeItem(`cc_last_query_${this.Cognito.userId}`)
      }
      this.IsLoggedIn = false
      this.Cognito = {}
    },
  },
})
