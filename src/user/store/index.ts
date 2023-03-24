/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Sync from '@/cloud/user_sync';
import { AutoSyncAll, AutoSyncRemotes } from '@/cloud/item_sync';
import * as Client from '../index';

export default {
  state: () => ({
    AuthStatus: 'No User',
    IsLoggedIn: false,
    CognitoUser: '',
    UserProfile: {} as Client.UserProfile,
    PatreonToken: {},
    AwsData: {},
    IsPatron: false,
  }),
  mutations: {
    LOAD_USER_PROFILE(state: any, payload: Client.UserProfile): void {
      state.UserProfile = payload;
    },

    SET_LOGGED_IN(state: any, payload: boolean): void {
      state.IsLoggedIn = payload;
    },

    SET_AUTH_STATUS(state: any, payload: string): void {
      state.AuthStatus = payload;
    },

    SET_COGNITO_USER(state: any, payload: any): void {
      state.CognitoUser = payload;
    },

    SET_USER_PROFILE(state: any, payload: any): void {
      state.UserProfile = payload;
    },

    SET_AWS_DATA(state: any, payload: any): void {
      state.AwsData = payload;
    },
  },
  actions: {
    setCognitoUser({ commit }: any, payload: any): void {
      commit('SET_COGNITO_USER', payload);
    },

    setUserProfile({ commit }: any, payload: any): void {
      commit('SET_USER_PROFILE', payload);
    },

    setLoggedIn({ commit }: any, payload: boolean): void {
      commit('SET_LOGGED_IN', payload);
    },

    getUserProfile({ state }: any): Client.UserProfile {
      return state.UserProfile;
    },
    async setAws(
      { state, dispatch, commit }: any,
      payload: { cognitoUser: any }
    ): Promise<void> {
      const syncedUser = await Sync.GetCloudProfile(
        payload.cognitoUser.user_id
      );

      await dispatch.setUserProfile(syncedUser);
      await dispatch.setLoggedIn(true);
      state.UserProfile.Username = payload.cognitoUser.attributes.email;

      if (state.UserProfile.SyncFrequency.cloudSync_v2) {
        console.info('auto-sync ON');
        try {
          await AutoSyncAll();
          await AutoSyncRemotes();
        } catch (error) {
          console.error('error in auto-sync:', error);
        }
      }
    },

    async loadUser({ commit }: any): Promise<void> {
      const localdata = await Client.getLocalProfile();
      commit('LOAD_USER_PROFILE', localdata);
    },

    async updateUserData({ state }: any): Promise<void> {
      console.info('Updating User Info');
      Sync.UpdateUserData(state.UserProfile);
    },
  },
};
