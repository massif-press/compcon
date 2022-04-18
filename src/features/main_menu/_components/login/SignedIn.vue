<template>
  <div>
    <div
      v-if="
        !!authedUser &&
        !!authedUser.attributes &&
        userProfile.Username &&
        userProfile.Username !== 'No Cloud Account'
      "
    >
      <v-row dense justify="space-between" align="center">
        <v-col v-if="userProfile" class="text-center heading h3 mt-3 mb-2">
          CONNECTED
          <cc-slashes />
          <b class="accent--text">
            {{ userProfile.Username }}
          </b>
        </v-col>

        <v-col cols="auto">
          <v-btn small tile color="warning darken-1" :loading="loading" @click="signOut">
            Sign Out
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">CHANGE PASSWORD</v-col>
      </v-row>
      <v-row dense class="my-2">
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="oldpass"
            outlined
            dense
            label="Old Password"
            :type="showOld ? 'text' : 'password'"
            :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showOld = !showOld"
          />
        </v-col>
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="newpass"
            outlined
            dense
            label="New Password"
            :rules="[rules.passLength, passMatch]"
            :type="showNew ? 'text' : 'password'"
            :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showNew = !showNew"
          />
        </v-col>
      </v-row>
      <v-row no-gutters justify="end" class="mt-n3">
        <v-col cols="auto">
          <v-btn
            text
            color="accent"
            :disabled="!oldpass || !newpass || oldpass === newpass"
            :loading="loading"
            @click="changePass"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">ACCOUNT DATA</v-col>
      </v-row>
      <div v-if="iid" class="caption text-center mt-1 mb-n3">
        COMP/CON USER IDENTITYID: {{ iid }}
        <cc-tooltip simple inline content="Copy IID to clipboard">
          <v-btn icon small right @click="copyIid()">
            <v-icon small>mdi-clipboard-text-outline</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>

      <v-alert class="my-3" prominent icon="mdi-alert" color="warning darken-2" outlined>
        <b>Cloud Sync functionality has changed</b>
        <div class="text--text">
          Cloud auto-syncing has
          <b>changed,</b>
          manual saving or loading to/from the cloud can be done here, or through the options in the
          nav bar. If auto-sync is enabled, COMP/CON will try to sync all local and cloud data when
          your account is logged in.
        </div>

        <div v-show="!isOnV2" class="pa-2">
          <v-card outlined style="border-color: var(--v-error-base); border-width: 3px">
            <div class="font-weight-bold text--text pa-2">
              COMP/CON has determined that your cloud account is not configured for the most recent
              backend changes. Clicking the upgrade button will save a backup of your current local
              data and attempt to update your account data. This process should take less than a
              second and the app will reload itself once complete.
            </div>
            <div class="px-12 py-2">
              <v-btn block class="secondary" :loading="upgradeLoading" @click="v2Upgrade()">
                UPGRADE
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-alert>

      <v-card v-if="isOnV2" class="mt-3 mb-6">
        <v-card-title class="heading h3">Auto-sync settings</v-card-title>
        <v-card-text class="px-10">
          <v-row dense align="center">
            <v-col>
              <span class="heading h3">
                On Login
                <cc-tooltip
                  inline
                  content="This will automatically smart sync all item and LCP data whenever the account login process is successful. If you do not log out, this will occur shortly after the application starts. "
                >
                  <v-icon left>mdi-information-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-col>
            <v-col cols="auto" class="mr-n3">
              <v-switch
                v-model="userProfile.SyncFrequency.cloudSync_v2"
                dense
                hide-details
                inset
                color="accent"
                @change="userUpdate()"
              />
            </v-col>
            <v-col v-if="userProfile.SyncFrequency.cloudSync_v2" cols="auto"><b>ON</b></v-col>
            <v-col v-else cols="auto"><i>OFF</i></v-col>
          </v-row>
          <v-row dense align="center">
            <v-col>
              <span class="heading h3">
                Sync Remote Resources
                <cc-tooltip
                  inline
                  content="This will automatically attempt to sync all remote resources with the latest versions in their authors' cloud accounts. Remote data cannot be saved to your own cloud account."
                >
                  <v-icon left>mdi-information-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-col>
            <v-col cols="auto" class="mr-n3">
              <v-switch
                v-model="userProfile.SyncFrequency.remotes"
                dense
                hide-details
                inset
                color="accent"
                @change="userUpdate()"
              />
            </v-col>
            <v-col v-if="userProfile.SyncFrequency.remotes" cols="auto"><b>ON</b></v-col>
            <v-col v-else cols="auto"><i>OFF</i></v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <sync-manager ref="sync" />
      <v-divider class="my-6" />
      <cloud-content-manager ref="lcps" />
      <v-divider class="my-6" />
      <backup-manager
        ref="backup"
        :username="userProfile.Username"
        @change="$refs.sync.fetch()"
        @del-local="$refs.lcps ? $refs.lcps.deleteAllLocal : ''"
        @del-cloud="$refs.lcps ? $refs.lcps.deleteAllCloud : ''"
      />

      <v-scroll-y-transition leave-absolute hide-on-leave>
        <v-alert
          v-if="error"
          v-model="showError"
          color="error darken-1"
          dark
          dense
          class="mt-2"
          icon="mdi-alert"
          dismissible
        >
          <div class="font-weight-bold">ERROR</div>
          <div v-html="error" />
        </v-alert>
      </v-scroll-y-transition>
    </div>
    <div v-else>
      <v-row no-gutters justify="center" align="center" style="height: 100%">
        <v-col cols="auto">
          <v-progress-circular intermediate size="60" color="primary" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncManager from '@/ui/syncManager/SyncManager.vue'
import CloudContentManager from '@/ui/syncManager/CloudContentManager.vue'
import BackupManager from '@/ui/syncManager/BackupManager.vue'
import { Auth } from '@aws-amplify/auth'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UpdateUserData } from '@/cloud/user_sync'
import _ from 'lodash'

export default Vue.extend({
  name: 'auth-signed-in',
  components: { SyncManager, BackupManager, CloudContentManager },
  data: () => ({
    upgradeLoading: false,
    loading: false,
    showError: false,
    error: '',
    iid: '',
    oldpass: null,
    showOld: false,
    newpass: null,
    showNew: false,
    rules: {
      passLength: v => (v && v.length >= 6) || 'Minimum 6 characters',
    },
    authedUser: null,
  }),
  computed: {
    passMatch() {
      return () =>
        (this.oldpass && this.newpass && this.oldpass !== this.newpass) ||
        'Password must be different'
    },
    userProfile() {
      return getModule(UserStore, this.$store).UserProfile
    },
    isOnV2() {
      return this.userProfile && _.has(this.userProfile.SyncFrequency, 'cloudSync_v2')
    },
  },
  mounted() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.authedUser = user
      })
      .then(() => Auth.currentUserCredentials().then(res => (this.iid = res.identityId)))
      .catch(() => {
        this.$emit('set-state', 'sign-in')
      })
  },
  methods: {
    async load() {
      this.loading = true
      const userstore = getModule(UserStore, this.$store)
      Auth.currentAuthenticatedUser()
        .then(cognitoUser => {
          userstore.setAws({ cognitoUser })
        })
        .then(() => {
          this.loading = false
          this.$notify('Cloud Load Complete', 'success')
        })
        .catch(err => {
          console.error(err)
          this.loading = false
        })
    },
    changePass() {
      this.loading = true
      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, this.oldpass, this.newpass)
        })
        .then(() => {
          this.loading = false
          this.showError = false
          this.$notify('Password Changed')
          this.oldpass = null
          this.newpass = null
        })
        .catch(err => {
          this.loading = false
          this.showError = true
          this.error = `${err.message}<br><div class='text-right'>${err.name}</div>`
        })
    },
    signOut() {
      Auth.signOut()
        .then(() => {
          this.$notify('Sign Out Complete')
          const store = getModule(UserStore, this.$store)
          store.setLoggedIn(false)
          this.$emit('set-state', 'sign-in')
        })
        .catch(err => {
          console.error(err)
        })
    },
    userUpdate() {
      UpdateUserData(this.userProfile).then(res => console.log(res))
    },
    copyIid() {
      navigator.clipboard
        .writeText(this.iid)
        .then(() => Vue.prototype.$notify('Cloud Identity ID copied to clipboard.', 'confirmation'))
        .catch(() => Vue.prototype.$notifyError('Unable to copy Cloud Identity ID '))
    },
    async v2Upgrade() {
      this.upgradeLoading = true
      try {
        await this.$refs.backup.dataExport()
        await this.$refs.lcps.syncAll(true)
        await this.$refs.sync.syncAll(true)
        await UpdateUserData(this.userProfile, true)
        this.$notify('Data successfully updated. Reloading.', 'success')
        setTimeout(() => {
          location.reload()
        }, 2000)
      } catch (error) {
        console.error(error)
        this.$notify('An error occured while syncing.', 'error')
      } finally {
        this.upgradeLoading = false
      }
    },
  },
})
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
