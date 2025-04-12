<template>
  <v-container :class="!mobile && 'px-12'">
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

    <v-expansion-panels class="mb-4" flat color="panel" tile>
      <v-expansion-panel>
        <template #title>
          <v-row dense>
            <v-col>
              <div class="text-caption font-weight-bold my-1">NOTIFICATIONS</div>
            </v-col>
            <v-col cols="auto">
              <v-chip size="small" color="accent">{{ notifications.length }}</v-chip>
            </v-col>
          </v-row>
        </template>
        <template #text>
          <cloud-notification-list />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row>
      <v-col cols="12" md="6">
        <cc-heading
          title
          text="CC-ID"
          tooltip="Your unique account ID. This is used to identify your account in the cloud and may be
          requested for troubleshooting purposes." />
        {{ cognito.userId }}
      </v-col>
      <v-col cols="12" md="6">
        <cc-heading
          title
          text="Account Email"
          tooltip="This is the e-mail address associated with your account. You can use this to log in to
            COMP/CON, Nautilus, and other Massif apps. This address is only visible to you and and
            <b>will not</b>
            be shown to other users in active mode or in shared data." />

        {{ cognito.signInDetails.loginId }}
      </v-col>
      <v-col cols="12" md="6">
        <cc-heading
          title
          text="CC-username"
          tooltip="This is an <b>optional</b> field that you can use to set a custom name for your account. This username <b>will</b> be visible to other users in active mode and when sharing data." />

        <v-row dense align="center">
          <v-col>
            <form autocomplete="off">
              <cc-text-field
                v-model="meta.Username"
                :loading="nameLoading"
                color="primary"
                autocomplete="one-time-code"
                @update:model-value="nameDirty = true" />
            </form>
          </v-col>
          <v-col cols="auto">
            <cc-button
              size="small"
              class="ml-2"
              color="primary"
              icon="mdi-content-save"
              variant="outlined"
              :loading="nameLoading"
              :disabled="!nameDirty"
              @click="userUpdate('username')" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <cc-heading title text="Account Details" />
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
        <v-col cols="12" md="6">
          <itch-card />
        </v-col>
        <v-col cols="12" md="6">
          <patreon-card />
        </v-col>
      </v-row>
    </div>

    <cc-heading small line>Change password</cc-heading>
    <v-row dense align="center">
      <v-col cols="12" md="">
        <cc-text-field
          v-model="oldPass"
          label="Old Password"
          color="primary"
          variant="outlined"
          :type="showOld ? 'text' : 'password'"
          :append-inner-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showOld = !showOld" />
      </v-col>
      <v-col cols="12" md="">
        <cc-text-field
          v-model="newPass"
          label="New Password"
          color="primary"
          variant="outlined"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showNew = !showNew" />
      </v-col>
      <v-col cols="12" md="auto">
        <div class="text-right">
          <cc-button
            color="accent"
            :disabled="!oldPass || !newPass || oldPass === newPass"
            :loading="loading"
            @click="changePass">
            Submit
          </cc-button>
        </div>
      </v-col>
    </v-row>

    <cc-heading small line>Change Account E-Mail</cc-heading>
    <v-row dense align="center">
      <v-col cols="12" md="">
        <cc-text-field v-model="newEmail" label="New E-Mail" color="primary" variant="outlined" />
      </v-col>
      <v-col cols="12" md="">
        <cc-text-field
          v-model="newEmailConfirm"
          label="Confirm New E-Mail"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="auto">
        <div class="text-right">
          <cc-modal title="Change Account E-Mail" shrink max-width="50vw">
            <template #activator="{ open }">
              <cc-button
                color="accent"
                :disabled="!newEmail || newEmail !== newEmailConfirm"
                :loading="loading"
                @click="sendVerify(open)">
                Submit
              </cc-button>
            </template>
            <template #default="{ close }">
              <div v-if="sendingVerify" class="text-center py-4">
                <v-progress-circular indeterminate size="80" class="my-2" />
                <div class="text-cc-overline">working...</div>
              </div>
              <div v-else>
                <p class="mb-3">
                  A verification e-mail has been sent to {{ newEmail }}. Please check your inbox and
                  enter the verification code below to finalize your changes.
                </p>
                <cc-text-field
                  v-model="verifyCode"
                  label="Verification Code"
                  color="primary"
                  variant="outlined"
                  autocomplete="one-time-code" />
              </div>
              <v-row class="my-3">
                <v-col>
                  <cc-button
                    color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="close">
                    Cancel
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button
                    color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="resetEmail(close)">
                    Reset
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button
                    color="success"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="completeVerify">
                    Confirm
                  </cc-button>
                </v-col>
              </v-row>
            </template>
          </cc-modal>
        </div>
      </v-col>
    </v-row>

    <cc-button block color="secondary" :loading="loading" @click="ccSignOut" class="my-12">
      Sign Out
      <template #info>
        <v-icon icon="mdi-logout" />
      </template>
    </cc-button>

    <div class="text-right">
      <cc-modal title="Account Deletion" max-width="50vw" shrink>
        <template #activator="{ open }">
          <cc-button @click="open" variant="tonal" color="error" prepend-icon="mdi-skull">
            Delete Cloud Account
          </cc-button>
        </template>
        <template #default="{ isActive }">
          <delete-account @close="isActive.value = false" />
        </template>
      </cc-modal>
    </div>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import _ from 'lodash';
import { updateUser } from '@/io/apis/account';
import {
  signOut,
  updatePassword,
  confirmUserAttribute,
  updateUserAttributes,
} from 'aws-amplify/auth';
import DeleteAccount from './_components/deleteAccount.vue';
import PatreonCard from './_components/patreonCard.vue';
import ItchCard from './_components/itchCard.vue';
import CloudNotificationList from '@/features/nav/_components/CloudNotificationList.vue';
import logger from '@/user/logger';

export default {
  name: 'account-management',
  components: { DeleteAccount, PatreonCard, ItchCard, CloudNotificationList },
  data: () => ({
    loading: false,
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
    newEmail: '',
    newEmailConfirm: '',
    sendingVerify: false,
    verifyCode: '',
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
    passMatch() {
      return () =>
        (this.oldPass && this.newPass && this.oldPass !== this.newPass) ||
        'Password must be different';
    },
    user() {
      return UserStore().User;
    },
    notifications() {
      return UserStore().CloudNotifications;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
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
        logger.error(`Failed to change password: ${err}`, this);
        this.$notify({
          title: 'Password update failed',
          text: 'The server returned an error',
          data: { color: 'error' },
        });
      }

      this.loading = false;
    },
    async sendVerify(open) {
      open();
      this.sendingVerify = true;
      try {
        await updateUserAttributes({ userAttributes: { email: this.newEmail } });
        this.$notify({
          title: 'Verification e-mail sent',
          text: 'Please check your inbox for the verification code',
          data: { color: 'success' },
        });
      } catch (err) {
        this.$notify({
          title: 'Failed to initiate email change',
          text: 'The server returned an error',
          data: { color: 'error' },
        });
      }
      this.sendingVerify = false;
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
          window.location.reload();
          this.$emit('set-state', 'sign-in');
        })
        .catch((err) => {
          logger.error(`Error signing out: ${err}`, this);
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
    async completeVerify() {
      this.loading = true;
      try {
        await confirmUserAttribute({
          userAttributeKey: 'email',
          confirmationCode: this.verifyCode,
        });
        this.$notify({
          title: 'E-mail change complete',
          text: 'Your e-mail address has been changed',
          data: { color: 'success' },
        });
      } catch (err) {
        logger.error(`Failed to initiate email change: ${err}`, this);
        this.$notify({
          title: 'E-mail change failed',
          text: 'The server returned an error',
          data: { color: 'error' },
        });
      } finally {
        this.loading = false;
      }
    },
    resetEmail(close) {
      close();
      this.sendingVerify = false;
      this.verifyCode = '';
      this.newEmail = '';
      this.newEmailConfirm = '';
      this.$notify({
        title: 'E-mail change cancelled',
        text: 'The e-mail change has been cancelled',
        data: { color: 'info' },
      });
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
