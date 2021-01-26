<template>
  <div>
    <div v-if="!!authedUser && !!authedUser.attributes">
      <div class="text-center heading h3 mt-3">
        CONNECTED
        <cc-slashes />
        <b class="accent--text">{{ authedUser.attributes.email.toUpperCase() }}</b>
      </div>
      <v-row>
        <v-col>
          <v-btn tile small block color="secondary" disabled class="my-1">
            Link Patreon Account
          </v-btn>
        </v-col>
        <v-col>
          <v-btn tile small block color="secondary" disabled class="my-1">
            Link itch.io Account
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">
          ACCOUNT INFORMATION
        </v-col>
      </v-row>
      <v-row dense justify="space-between" align="center">
        <v-col>
          <div class="overline font-weight-bold my-0">
            VAULT CONTENTS
            <cc-slashes />
            {{ authedUser.attributes.sub }}
          </div>
          <p class="body-text ml-3">
            <b class="accent--text">{{ userProfile.Pilots.length }}</b>
            Pilots
            <!-- <b class="accent--text">X</b>
            Groups (
            <b class="accent--text">X</b>
            Ungrouped) -->
            <br />
            Last Sync: {{ userProfile.LastSync }}
          </p>
        </v-col>
        <v-col cols="auto" class="mr-6">
          <cc-tooltip content="Manual Sync">
            <v-btn fab large elevation="0" color="accent" dark :loading="loading" @click="sync()">
              <v-icon x-large>mdi-cloud-sync-outline</v-icon>
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
      <!-- <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">
          ACCOUNT OPTIONS
        </v-col>
      </v-row>
      <v-card tile outlined class="my-2">
        <v-toolbar dense flat tile color="light-panel">
          <div class="heading h3">SYNC FREQUENCY</div>
        </v-toolbar>
        <v-row dense align="center">
          <v-col cols="auto">
            <v-switch hide-details class="px-6" label="Manual Sync Only" />
          </v-col>
          <v-divider vertical class="mx-3" />
          <v-col>
            <v-row dense>
              <v-col lg="4" cols="6"><v-switch hide-details label="On App Load" /></v-col>
              <v-col lg="4" cols="6"><v-switch hide-details label="On App Exit" /></v-col>
            </v-row>
            <v-row dense>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Pilot Level Up" />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Pilot Creation" />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Mech Creation" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On NPC Creation" disabled />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Encounter Creation" disabled />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Mission Creation" disabled />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col lg="4" cols="6">
                <v-switch hide-details label="On Mission Start" disabled />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch dense hide-details label="On Mission End" disabled />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="accent" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card> -->
      <!-- <v-card tile outlined class="my-2">
        <v-toolbar dense flat tile color="light-panel">
          <div class="heading h3">SYNC OPTIONS</div>
        </v-toolbar>
        <v-row dense>
          <v-col class="ml-4">
            <v-switch hide-details label="Prompt before overwriting local data." value="radio-2" />
            <v-switch hide-details label="Prompt before overwriting cloud data." value="radio-2" />
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="accent" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card> -->
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">
          CHANGE PASSWORD
        </v-col>
      </v-row>
      <v-row dense>
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
      <v-divider class="my-2" />
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn x-large tile color="warning darken-1" :loading="loading" @click="signOut">
            Sign Out
          </v-btn>
        </v-col>
      </v-row>
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
import { Auth } from '@aws-amplify/auth'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'

export default Vue.extend({
  name: 'auth-signed-in',
  data: () => ({
    loading: false,
    showError: false,
    error: '',
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
  },
  mounted() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(user)
        this.authedUser = user
      })
      .catch(() => {
        this.$emit('set-state', 'sign-in')
      })
  },
  methods: {
    sync() {
      this.loading = true
      const userstore = getModule(UserStore, this.$store)
      userstore
        .cloudSync((status: string, message: string) => this.$notify(message, status))
        .then(() => {
          this.loading = false
          this.$notify('Sync Complete', 'success')
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
  },
})
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}
</style>
