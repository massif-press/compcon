<template>
  <div>
    <div v-if="!!authedUser && !!authedUser.attributes">
      <div v-if="userProfile" class="text-center heading h3 mt-3 mb-2">
        CONNECTED
        <cc-slashes />
        <b class="accent--text">
          {{ userProfile.Username }}
        </b>
      </div>
      <!-- <v-row dense>
        <v-col>
          <v-btn tile small block color="patreon" depressed class="my-1">
            <v-icon left>mdi-check</v-icon>
            Patreon Account Linked
          </v-btn>
        </v-col>
        <v-col>
          <v-btn tile small block color="secondary" disabled class="my-1">
            Link itch.io Account
          </v-btn>
        </v-col>
      </v-row> -->
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
          <p v-if="userProfile" class="body-text ml-3">
            <b class="accent--text">{{ userProfile.Pilots.length }}</b>
            Pilots
            <cc-slashes />
            <b class="accent--text">{{ userProfile.Npcs.length }}</b>
            NPCs
            <cc-slashes />
            <b class="accent--text">{{ userProfile.Encounters.length }}</b>
            Encounters
            <cc-slashes />
            <b class="accent--text">{{ userProfile.Missions.length }}</b>
            Missions
            <cc-slashes />
            <b class="accent--text">{{ userProfile.ActiveMissions.length }}</b>
            Active Missions
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
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">
          ACCOUNT OPTIONS
        </v-col>
      </v-row>
      <v-card tile outlined class="my-2">
        <v-toolbar dense flat tile color="light-panel">
          <div class="heading h3">SYNC FREQUENCY</div>
        </v-toolbar>
        <v-row dense align="center" class="pa-2">
          <v-col md="auto" cols="12">
            <v-switch
              :input-value="isManualOnly"
              hide-details
              color="accent"
              :class="$vuetify.breakpoint.mdAndUp ? 'px-6' : ''"
              label="Manual Sync Only"
              @change="setManualOnly($event)"
            />
          </v-col>
          <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical class="mx-3" />
          <v-col>
            <v-row v-if="userProfile" dense>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onAppLoad"
                  hide-details
                  color="accent"
                  label="On App Load"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onLogIn"
                  hide-details
                  color="accent"
                  label="On User Sign In"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onBulkDelete"
                  hide-details
                  color="accent"
                  label="On Bulk Data Overwrite"
                />
              </v-col>
              <!-- <v-col lg="4" cols="6"><v-switch v-model="userProfile.SyncFrequency.onAppLoad" hide-details color="accent" label="On App Exit" /></v-col> -->
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onThemeChange"
                  hide-details
                  color="accent"
                  label="On Theme Change"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onPilotLevel"
                  hide-details
                  color="accent"
                  label="On Pilot Level Up"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onPilotCreate"
                  hide-details
                  color="accent"
                  label="On Pilot Creation"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onPilotDelete"
                  hide-details
                  color="accent"
                  label="On Pilot Deletion"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onMechCreate"
                  hide-details
                  color="accent"
                  label="On Mech Creation"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onMechDelete"
                  hide-details
                  color="accent"
                  label="On Mech Deletion"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onNpcCreate"
                  hide-details
                  color="accent"
                  label="On NPC Creation"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onNpcDelete"
                  hide-details
                  color="accent"
                  label="On NPC Deletion"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onEncounterCreate"
                  hide-details
                  color="accent"
                  label="On Encounter Creation"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onEncounterDelete"
                  hide-details
                  color="accent"
                  label="On Encounter Deletion"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onMissionCreate"
                  hide-details
                  color="accent"
                  label="On Mission Creation"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onMissionDelete"
                  hide-details
                  color="accent"
                  label="On Mission Deletion"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onMissionStart"
                  hide-details
                  color="accent"
                  label="On Mission Start"
                />
              </v-col>
              <v-col lg="4" cols="6">
                <v-switch
                  v-model="userProfile.SyncFrequency.onTurnEnd"
                  hide-details
                  color="accent"
                  label="On Turn End"
                />
              </v-col>
            </v-row>
            <!-- <v-row dense>
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
            </v-row> -->
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="accent" :loading="loading" @click="sync()">Save</v-btn>
        </v-card-actions>
      </v-card>
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
    isManualOnly() {
      return !Object.values(this.userProfile.SyncFrequency).some((x: boolean) => x === true)
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
    setManualOnly(toggle) {
      if (toggle) {
        for (const k in this.userProfile.SyncFrequency) {
          if (Object.prototype.hasOwnProperty.call(this.userProfile.SyncFrequency, k)) {
            Vue.set(this.userProfile.SyncFrequency, k, false)
          }
        }
      }
    },
    sync() {
      this.loading = true
      const userstore = getModule(UserStore, this.$store)
      userstore
        .cloudSync({
          callback: (status: string, message: string) => this.$notify(message, status),
          condition: null,
        })
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

label {
  font-size: 10px;
}
</style>
