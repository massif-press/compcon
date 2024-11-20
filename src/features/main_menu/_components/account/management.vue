<template>
  <v-container class="px-12">
    <v-fade-transition>
      <v-alert
        v-if="showAccountMigration"
        border="start"
        border-color="accent"
        variant="outlined"
        color="accent"
        icon="mdi-transfer"
        class="mb-2"
        prominent>
        <div>
          <div class="heading h3">
            v2
            <v-icon icon="mdi-arrow-right" size="small" />
            v3 Account Migration
          </div>
          <div class="text-text" style="font-size: 14px">
            COMP/CON has detected that you have an existing account that has not yet been migrated
            to the new cloud system. The account migration tool will attempt to transfer all v2
            cloud data to the new v3 backend. This process may take some time; please don't refresh
            or close the page during the migration process. After using this tool (or dismissing
            it), you can find it again in the "Cloud Data" tab.
            <br />
            This tool will be available until XX/XX/XXXX, after which all v2 data will be archived.
          </div>
          <v-row class="mt-1">
            <v-col>
              <v-btn block color="accent" @click="" :loading="loading" disabled>
                Migrate v2 Account
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="error" @click="setDismissMigration">Dismiss</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-alert>
    </v-fade-transition>

    <v-row>
      <v-col cols="6">
        <div class="font-weight-bold text-accent">
          CC-ID
          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="x-small"
                color="primary"
                class="mt-n1"
                @click="copy(cognito.userId)">
                mdi-help-circle-outline
              </v-icon>
            </template>
            Your unique account ID. This is used to identify your account in the cloud and may be
            requested for troubleshooting purposes.
            <v-divider class="my-1" />
            Click to copy your CC-ID to the clipboard.
          </v-tooltip>
        </div>
        {{ cognito.userId }}
      </v-col>
      <v-col cols="6">
        <div class="font-weight-bold text-accent">
          ACCOUNT EMAIL
          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                mdi-help-circle-outline
              </v-icon>
            </template>
            This is the e-mail address associated with your account. You can use this to log in to
            COMP/CON, Nautilus, and other Massif apps. This address is only visible to you and and
            <b>will not</b>
            be shown to other users in active mode or in shared data.
          </v-tooltip>
        </div>
        {{ cognito.signInDetails.loginId }}
      </v-col>
      <v-col cols="6">
        <div class="font-weight-bold text-accent">
          CC-USERNAME
          <v-tooltip max-width="300px" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                mdi-help-circle-outline
              </v-icon>
            </template>
            This is an
            <b>optional</b>
            field that you can use to set a custom name for your account. This username
            <b>will</b>
            be visible to other users in active mode and when sharing data.
          </v-tooltip>
        </div>
        <v-text-field
          v-model="meta.Username"
          :loading="nameLoading"
          density="compact"
          hide-details
          autocomplete="cc-meta-username"
          @update:model-value="nameDirty = true">
          <template v-if="nameDirty" #append>
            <v-btn
              size="x-small"
              variant="plain"
              color="success"
              icon
              @click="userUpdate('username')">
              <v-icon size="35" icon="mdi-content-save" />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="font-weight-bold text-accent">ACCOUNT DETAILS</div>
        <div class="text-caption">
          <b>Account created (v3):</b>
          <i class="text-accent ml-1">{{ new Date(Number(meta.CreatedAt)).toLocaleString() }}</i>
        </div>
        <div class="text-caption">
          <b>Last updated:</b>
          <i class="text-accent ml-1">{{ new Date(Number(meta.UpdatedAt)).toLocaleString() }}</i>
        </div>
      </v-col>
    </v-row>

    <div class="flavor-text">
      <v-row class="text-center py-4">
        <v-col>
          <v-card size="small" color="#fa5c5c" disabled>
            <b>itch.io account:</b>
            <div class="text-disabled">Unlinked</div>
            Link itch.io
            <v-tooltip max-width="400px">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small">mdi-help-circle-outline</v-icon>
              </template>
              Linking your itch.io account will allow you to download Massif and community-approved
              homebrew content from the itch.io store with one click.
              <br />
              You can also subscribe to LCPs to auto-update your local copy when the author releases
              a new version.
            </v-tooltip>
          </v-card>
        </v-col>
        <v-col>
          <patreon-card v-if="patreon.hasPatreon" />
          <v-card v-else size="small" color="#FF424D" @click="loginWithPatreon">
            <b>Patreon account:</b>

            <div v-if="loadPatreon" class="ma-2">
              <v-progress-linear indeterminate color="white" height="12" rounded="md" />
            </div>
            <div v-else class="text-disabled">Unlinked</div>
            Link Patreon
            <v-tooltip max-width="400px">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small">mdi-help-circle-outline</v-icon>
              </template>
              If you are subscribed to the COMP/CON Patreon, linking your Patreon account will
              increase your maximum cloud storage space and unlock realtime table creation in GM
              mode.
            </v-tooltip>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="text-caption font-weight-bold my-1">CHANGE PASSWORD</div>
    <v-row dense>
      <v-col>
        <v-text-field
          v-model="oldPass"
          variant="outlined"
          density="compact"
          label="Old Password"
          :type="showOld ? 'text' : 'password'"
          :append-inner-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showOld = !showOld" />
      </v-col>
      <v-col>
        <v-text-field
          v-model="newPass"
          variant="outlined"
          density="compact"
          label="New Password"
          :rules="[rules.passLength, passMatch]"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showNew = !showNew" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="accent"
          :disabled="!oldPass || !newPass || oldPass === newPass"
          :loading="loading"
          @click="changePass">
          Submit
        </v-btn>
      </v-col>
    </v-row>

    <v-btn block color="warning" :loading="loading" @click="ccSignOut">Sign Out</v-btn>

    <div class="text-right mt-12">
      <v-dialog width="70vw">
        <template #activator="{ props }">
          <v-btn v-bind="props" size="small" color="error" prepend-icon="mdi-skull">
            Delete Cloud Account
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <delete-account @close="isActive.value = false" />
        </template>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import _ from 'lodash';
import { getUser, updateUser } from '@/io/apis/account';
import { signOut, updatePassword } from 'aws-amplify/auth';
import DeleteAccount from './_components/deleteAccount.vue';
import { authPatreon } from '@/user/patreon';
import PatreonCard from './_components/patreonCard.vue';

export default {
  name: 'account-management',
  components: { DeleteAccount, PatreonCard },
  data: () => ({
    loading: false,
    loadPatreon: false,
    showAccountMigration: true,
    nameLoading: false,
    nameDirty: false,
    showError: false,
    error: '',
    iid: '',
    username: 'todo',
    oldPass: '',
    showOld: false,
    newPass: '',
    showNew: false,
    rules: {
      passLength: (v) => (v && v.length >= 6) || 'Minimum 6 characters',
    },
    authedUser: null,
  }),
  emits: ['set-state'],
  created() {
    if (UserStore().UserMetadata.UserMigrated) this.showAccountMigration = false;
    const buttonDismissed = localStorage.getItem('dismissedMigration');
    if (buttonDismissed) this.showAccountMigration = false;
  },
  computed: {
    cognito() {
      return UserStore().Cognito;
    },
    meta() {
      return UserStore().UserMetadata;
    },
    patreon() {
      return UserStore().User.Patreon;
    },
    passMatch() {
      return () =>
        (this.oldPass && this.newPass && this.oldPass !== this.newPass) ||
        'Password must be different';
    },
    user() {
      return UserStore().User;
    },
  },
  methods: {
    setDismissMigration() {
      localStorage.setItem('dismissedMigration', 'true');
      this.showAccountMigration = false;
    },
    copy(str: string) {
      navigator.clipboard.writeText(str);
      this.$notify({
        title: `Data Copied`,
        text: `Copied ${str} to clipboard`,
        data: { icon: 'mdi-clipboard-text-outline', color: 'success-darken-2' },
      });
    },
    async changePass() {
      this.loading = true;

      try {
        await updatePassword({ oldPassword: this.oldPass, newPassword: this.newPass });
        this.$notify({
          title: 'Update complete',
          text: 'User password changed',
          data: { color: 'success' },
        });
      } catch (err) {
        console.error(err);
        this.$notify({
          title: 'Password update failed',
          text: 'The server returned an error',
          data: { color: 'error' },
        });
      }

      this.loading = false;
    },
    ccSignOut() {
      signOut()
        .then(() => {
          this.$notify({
            title: 'Sign Out Successful',
            text: 'Auth service reports successful logout',
            data: { color: 'success' },
          });
          UserStore().signOut();
          this.$emit('set-state', 'sign-in');
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async userUpdate(key: string) {
      if (key === 'username') this.nameLoading = true;

      const res = await updateUser(this.cognito.userId, { [key]: this.meta[key] });
      if (res && res.status === 200) {
        this.$notify({
          title: 'Update complete',
          text: 'User data updated',
          data: { color: 'success' },
        });
      } else {
        this.$notify({
          title: 'Update failed',
          text: 'The server returned an error',
          data: { color: 'error' },
        });
      }

      this.nameLoading = false;
      this.nameDirty = false;
    },
    openOAuthPopup(url, name, width = 500, height = 600) {
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      return window.open(
        url,
        name,
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
      );
    },

    async loginWithPatreon() {
      const clientId = import.meta.env.VITE_APP_PATREON_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_APP_PATREON_CALLBACK_URI;
      const state = Math.random().toString(36).substring(2); // Simple state generation

      const oauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identity&state=${state}`;

      this.openOAuthPopup(oauthUrl, 'Patreon Login');

      // Listen for messages from the popup
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return; // Ensure message is from the same origin
        if (event.data.type === 'patreon-code') {
          this.exchangeToken(event.data.code);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    },

    async exchangeToken(code) {
      this.loadPatreon = true;
      try {
        const data = await authPatreon(code);
        await UserStore().User.setPatreonData(data);
        this.loadPatreon = false;
      } catch (error) {
        console.error('Token Exchange Error:', error);
        this.loadPatreon = false;
      }
    },
  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
