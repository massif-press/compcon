<template>
  <v-card-text>
    <p>This tool will delete your account and all associated data. This includes:</p>

    <ul class="ml-6 mb-3">
      <li>Account login credentials and settings</li>
      <li>Cloud data, including saved pilots, mechs, and NPCs and other GM data</li>
      <li>Images uploaded to your personal cloud archive</li>
      <li>Account and LCP archives stored on the cloud</li>
      <li>All remotely stored active mode data and history</li>
    </ul>
    Additionally,
    <ul class="ml-6 mb-3">
      <li>Your save data will no longer sync between devices and browsers</li>
      <li>Any shared items will no longer update, and all share codes will expire</li>
      <li>Any active syncs will be terminated</li>
      <li>You will be removed from any active tables</li>
      <li>If you are a GM, all tables you own will be archived and slated for deletion</li>
      <li>
        If you publish a subscription feed, subscribers will no longer be able to receive updates
      </li>
    </ul>
    This will not
    <ul class="ml-6 mb-3">
      <li>Delete any local data on your device</li>
      <li>Revoke any purchases through itch.io or end your Patreon subscription</li>
    </ul>

    <cc-alert color="error" icon="mdi-alert" prominent>
      <b>This action is irreversible. This data will be permanently and irrevocably deleted.</b>
      <br />
      Please ensure you have a local backup of any data you wish to keep.
    </cc-alert>

    <div class="text-caption text-center my-1">
      Enter the text
      <i><b>delete account</b></i>
      to confirm account deletion.
    </div>
    <v-text-field v-model="confirm" label="delete account" type="text" required hide-details />
    <cc-button
      type="submit"
      color="red-darken-3"
      block
      size="x-large"
      class="mt-2"
      :loading="loading"
      :disabled="!confirmValid">
      Delete Account
    </cc-button>
    <v-fade-transition>
      <div v-if="loading" class="text-caption text-center my-1">
        <i>
          Deletion in progress. This may take a few moments. COMP/CON will restart once this process
          is complete.
        </i>
      </div>
    </v-fade-transition>
  </v-card-text>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { deleteUser } from 'aws-amplify/auth';

export default {
  name: 'delete-cloud-account',
  data: () => ({
    confirm: '',
    loading: false,
  }),
  computed: {
    confirmValid() {
      return this.confirm.toLowerCase() === 'delete account';
    },
  },
  methods: {
    async handleDeleteUser() {
      this.loading = true;
      try {
        await UserStore().deleteAllCloudData();
        await deleteUser();
        location.reload();
      } catch (error) {
        logger.error(`Error deleting user: ${error}`, this, error);
      }
    },
  },
};
</script>
