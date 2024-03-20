import { defineStore } from 'pinia';
import * as Client from '../index';

export const UserStore = defineStore('cloud', {
  state: () => ({
    User: {} as Client.UserProfile,
  }),
  actions: {
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile();
    },
  },
});
