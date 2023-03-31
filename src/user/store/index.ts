import { defineStore } from 'pinia';
import * as Sync from '@/cloud/user_sync';
// import { AutoSyncAll, AutoSyncRemotes } from '@/cloud/item_sync';
import * as Client from '../index';

export const UserStore = defineStore('cloud', {
  state: () => ({
    AuthStatus: 'No User',
    IsLoggedIn: false,
    CognitoUser: '',
    UserProfile: {} as Client.UserProfile,
    PatreonToken: {},
    AwsData: {},
    IsPatron: false,
  }),
  actions: {
    async loadUser({ commit }: any): Promise<void> {
      this.UserProfile = await Client.getLocalProfile();
    },
    setLoggedIn(payload: boolean): void {
      this.IsLoggedIn = payload;
    },
    setCognitoUser(payload: any): void {
      this.CognitoUser = payload;
    },

    setUserProfile(payload: any): void {
      this.UserProfile = payload;
    },
    getUserProfile(): Client.UserProfile {
      return this.UserProfile as Client.UserProfile;
    },
    async setAws(payload: { cognitoUser: any }): Promise<void> {
      const syncedUser = await Sync.GetCloudProfile(
        payload.cognitoUser.user_id
      );

      await this.setUserProfile(syncedUser);
      await this.setLoggedIn(true);
      this.UserProfile.Username = payload.cognitoUser.attributes.email;

      if (this.UserProfile.SyncFrequency.cloudSync_v2) {
        console.info('auto-sync ON');
        try {
          // await AutoSyncAll();
          // await AutoSyncRemotes();
        } catch (error) {
          console.error('error in auto-sync:', error);
        }
      }
    },
    async updateUserData({ state }: any): Promise<void> {
      console.info('Updating User Info');
      Sync.UpdateUserData(state.UserProfile);
    },
  },
});
