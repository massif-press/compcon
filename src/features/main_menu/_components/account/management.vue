<template>
  <v-container :class="!mobile && 'px-12'">
    <v2-cloud-migration-panel />

    <v-expansion-panels class="mb-4"
      flat
      color="panel"
      tile>
      <v-expansion-panel>
        <template #title>
          <v-row dense>
            <v-col>
              <div class="text-caption font-weight-bold my-1">NOTIFICATIONS</div>
            </v-col>
            <v-col cols="auto">
              <v-chip size="small"
                color="accent">{{ notifications.length }}</v-chip>
            </v-col>
          </v-row>
        </template>
        <template #text>
          <cloud-notification-list />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          text="CC-ID"
          tooltip="Your unique account ID. This is used to identify your account in the cloud and may be
          requested for troubleshooting purposes." />
        {{ cognito.userId }}
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          text="Account Email"
          tooltip="This is the e-mail address associated with your account. You can use this to log in to
            COMP/CON, Nautilus, and other Massif apps. This address is only visible to you and and
            <b>will not</b>
            be shown to other users in active mode or in shared data." />

        {{ cognito.signInDetails.loginId }}
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          text="CC-username"
          tooltip="This is an <b>optional</b> field that you can use to set a custom name for your account. This username <b>will</b> be visible to other users in active mode and when sharing data." />

        <v-row dense
          align="center">
          <v-col>
            <form autocomplete="off">
              <cc-text-field v-model="meta.Username"
                :loading="nameLoading"
                color="primary"
                autocomplete="one-time-code"
                @update:model-value="nameDirty = true" />
            </form>
          </v-col>
          <v-col cols="auto">
            <cc-button size="small"
              class="ml-2"
              color="primary"
              icon="mdi-content-save"
              variant="outlined"
              :loading="nameLoading"
              :disabled="!nameDirty"
              @click="userUpdate('Username')" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12"
        md="6">
        <cc-heading is-title
          text="Account Details" />
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
        <v-col cols="12"
          md="6">
          <itch-card />
        </v-col>
        <v-col cols="12"
          md="6">
          <patreon-card />
        </v-col>
      </v-row>
    </div>

    <cc-heading small
      line>Change password</cc-heading>
    <v-row dense
      align="center">
      <v-col cols="12"
        md="">
        <cc-text-field v-model="oldPass"
          label="Old Password"
          color="primary"
          variant="outlined"
          :type="showOld ? 'text' : 'password'"
          :append-inner-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showOld = !showOld" />
      </v-col>
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newPass"
          label="New Password"
          color="primary"
          variant="outlined"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @click-append-inner="showNew = !showNew" />
      </v-col>
      <v-col cols="12"
        md="auto">
        <div class="text-right">
          <cc-button color="accent"
            :disabled="!oldPass || !newPass || oldPass === newPass"
            :loading="loading"
            @click="changePass">
            Submit
          </cc-button>
        </div>
      </v-col>
    </v-row>

    <cc-heading small
      line>Change Account E-Mail</cc-heading>
    <v-row dense
      align="center">
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newEmail"
          label="New E-Mail"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="12"
        md="">
        <cc-text-field v-model="newEmailConfirm"
          label="Confirm New E-Mail"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="auto">
        <div class="text-right">
          <cc-modal title="Change Account E-Mail"
            shrink
            max-width="50vw">
            <template #activator="{ open }">
              <cc-button color="accent"
                :disabled="!newEmail || newEmail !== newEmailConfirm"
                :loading="loading"
                @click="sendVerify(open)">
                Submit
              </cc-button>
            </template>
            <template #default="{ close }">
              <div v-if="sendingVerify"
                class="text-center py-4">
                <v-progress-circular indeterminate
                  size="80"
                  class="my-2" />
                <div class="text-cc-overline">working...</div>
              </div>
              <div v-else>
                <p class="mb-3">
                  A verification e-mail has been sent to {{ newEmail }}. Please check your inbox and
                  enter the verification code below to finalize your changes.
                </p>
                <cc-text-field v-model="verifyCode"
                  label="Verification Code"
                  color="primary"
                  variant="outlined"
                  autocomplete="one-time-code" />
              </div>
              <v-row class="my-3">
                <v-col>
                  <cc-button color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="close">
                    Cancel
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button color="primary"
                    block
                    size="small"
                    :disabled="!verifyCode"
                    :loading="loading"
                    @click="resetEmail(close)">
                    Reset
                  </cc-button>
                </v-col>
                <v-col>
                  <cc-button color="success"
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

    <cc-button block
      color="secondary"
      :loading="loading"
      class="my-12"
      @click="ccSignOut">
      Sign Out
      <template #info>
        <v-icon icon="mdi-logout" />
      </template>
    </cc-button>

    <div class="text-right">
      <cc-modal title="Account Deletion"
        max-width="50vw"
        shrink>
        <template #activator="{ open }">
          <cc-button variant="tonal"
            color="error"
            prepend-icon="mdi-skull"
            @click="open">
            Delete Cloud Account
          </cc-button>
        </template>
        <template #default="{ close }">
          <delete-account @close="close()" />
        </template>
      </cc-modal>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
import { notify } from '@kyvg/vue3-notification'
import { UserStore } from '@/stores';
import { updateUser } from '@/io/apis/account';
import {
  signOut,
  updatePassword,
  confirmUserAttribute,
  updateUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import DeleteAccount from './_components/deleteAccount.vue';
import PatreonCard from './_components/patreonCard.vue';
import ItchCard from './_components/itchCard.vue';
import CloudNotificationList from '@/features/nav/_components/CloudNotificationList.vue';
import logger from '@/user/logger';
import V2CloudMigrationPanel from './_components/v2CloudMigrationPanel.vue';

defineOptions({ name: 'AccountManagement' })

const { mdAndDown: mobile } = useDisplay()

const emit = defineEmits<{
  'set-state': [state: string]
}>()

const loading = ref(false)
const nameLoading = ref(false)
const nameDirty = ref(false)
const oldPass = ref('')
const showOld = ref(false)
const newPass = ref('')
const showNew = ref(false)
const newEmail = ref('')
const newEmailConfirm = ref('')
const sendingVerify = ref(false)
const verifyCode = ref('')

const cognito = computed(() => UserStore().Cognito)
const meta = computed(() => UserStore().UserMetadata)
const notifications = computed(() => UserStore().CloudNotifications)

async function _onJwtShortcut(e: KeyboardEvent) {
  if (e.ctrlKey && e.altKey && e.key === 'j') {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()
      if (!token) throw new Error('No token available')
      await navigator.clipboard.writeText(token)
      notify({ title: 'JWT Copied', text: 'ID token copied to clipboard', data: { icon: 'mdi-key', color: 'success-darken-2' } } as any)
    } catch (err) {
      notify({ title: 'JWT Copy Failed', text: String(err), data: { icon: 'mdi-alert', color: 'error' } } as any)
    }
  }
}

onMounted(() => window.addEventListener('keydown', _onJwtShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', _onJwtShortcut))

async function changePass() {
  loading.value = true;
  try {
    await updatePassword({ oldPassword: oldPass.value, newPassword: newPass.value });
    notify({ title: 'Update complete', text: 'User password changed', data: { color: 'success' } } as any)
  } catch (err) {
    logger.error(`Failed to change password: ${err}`, null, err);
    notify({ title: 'Password update failed', text: 'The server returned an error', data: { color: 'error' } } as any)
  }
  loading.value = false;
}
async function sendVerify(open: () => void) {
  sendingVerify.value = true;
  try {
    await updateUserAttributes({ userAttributes: { email: newEmail.value } });
    notify({ title: 'Verification e-mail sent', text: 'Please check your inbox for the verification code', data: { color: 'success' } } as any)
    open();
  } catch (err) {
    logger.error(`Failed to initiate email change: ${err}`, null, err);
    notify({ title: 'Failed to initiate email change', text: 'The server returned an error', data: { color: 'error' } } as any)
  }
  sendingVerify.value = false;
}
function ccSignOut() {
  signOut()
    .then(() => {
      notify({ title: 'Sign Out Successful', text: 'Auth service reports successful logout', data: { color: 'success' } } as any)
      UserStore().signOut();
      window.location.reload();
      emit('set-state', 'sign-in');
    })
    .catch((err) => { logger.error(`Error signing out: ${err}`, null, err); });
}
async function userUpdate(key: string) {
  if (key === 'Username') nameLoading.value = true;
  const backendKeys: Record<string, string> = { Username: 'username' };
  const res = await updateUser(cognito.value.userId, { [backendKeys[key] || key]: meta.value[key] });
  if (res && res.status === 200) {
    notify({ title: 'Update complete', text: 'User data updated', data: { color: 'success' } } as any)
  } else {
    notify({ title: 'Update failed', text: 'The server returned an error', data: { color: 'error' } } as any)
  }
  nameLoading.value = false;
  nameDirty.value = false;
}
async function completeVerify() {
  loading.value = true;
  try {
    await confirmUserAttribute({ userAttributeKey: 'email', confirmationCode: verifyCode.value });
    notify({ title: 'E-mail change complete', text: 'Your e-mail address has been changed', data: { color: 'success' } } as any)
  } catch (err) {
    logger.error(`Failed to initiate email change: ${err}`, null, err);
    notify({ title: 'E-mail change failed', text: 'The server returned an error', data: { color: 'error' } } as any)
  } finally {
    loading.value = false;
  }
}
function resetEmail(close: () => void) {
  close();
  sendingVerify.value = false;
  verifyCode.value = '';
  newEmail.value = '';
  newEmailConfirm.value = '';
  notify({ title: 'E-mail change cancelled', text: 'The e-mail change has been cancelled', data: { color: 'info' } } as any)
}
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
