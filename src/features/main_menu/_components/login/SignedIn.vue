<template>
  <div>
    <div v-if="!!authedUser && !!authedUser.attributes && userProfile.Username">
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
        <v-col cols="auto">
          <v-btn
            x-large
            tile
            color="warning darken-1"
            :loading="loading"
            @click="signOut"
          >
            Sign Out
          </v-btn>
        </v-col>
      </v-row>

      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px"> CHANGE PASSWORD </v-col>
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
        <v-col cols="auto" style="letter-spacing: 5px"> ACCOUNT DATA </v-col>
      </v-row>
      <v-alert
        class="my-3"
        prominent
        icon="mdi-alert"
        color="warning darken-2"
        outlined
      >
        <b>Cloud Sync functionality has changed</b><br />
        Cloud auto-syncing has been <b>disabled</b>, manual saving or loading
        to/from the cloud can be done here, or through the options in the nav
        bar.
      </v-alert>

      <sync-manager />

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
import Vue from "vue";
import SyncManager from "@/ui/syncManager/SyncManager.vue";
import { Auth } from "@aws-amplify/auth";
import { getModule } from "vuex-module-decorators";
import { UserStore } from "@/store";

export default Vue.extend({
  name: "auth-signed-in",
  components: { SyncManager },
  data: () => ({
    loading: false,
    showError: false,
    error: "",
    oldpass: null,
    showOld: false,
    newpass: null,
    showNew: false,
    rules: {
      passLength: (v) => (v && v.length >= 6) || "Minimum 6 characters",
    },
    authedUser: null,
  }),
  computed: {
    passMatch() {
      return () =>
        (this.oldpass && this.newpass && this.oldpass !== this.newpass) ||
        "Password must be different";
    },
    userProfile() {
      return getModule(UserStore, this.$store).UserProfile;
    },
  },
  mounted() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.authedUser = user;
      })
      .catch(() => {
        this.$emit("set-state", "sign-in");
      });
  },
  methods: {
    async save() {
      this.loading = true;
      const userstore = getModule(UserStore, this.$store);
      userstore
        .cloudSave({
          callback: (status: string, message: string) =>
            this.$notify(message, status),
          condition: null,
        })
        .then(() => {
          this.loading = false;
          this.$notify("Cloud Save Complete", "success");
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    async load() {
      this.loading = true;
      const userstore = getModule(UserStore, this.$store);
      Auth.currentAuthenticatedUser()
        .then((user) => {
          userstore.setAws({ user: user });
        })
        .then(() => {
          this.loading = false;
          this.$notify("Cloud Load Complete", "success");
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    changePass() {
      this.loading = true;
      Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, this.oldpass, this.newpass);
        })
        .then(() => {
          this.loading = false;
          this.showError = false;
          this.$notify("Password Changed");
          this.oldpass = null;
          this.newpass = null;
        })
        .catch((err) => {
          this.loading = false;
          this.showError = true;
          this.error = `${err.message}<br><div class='text-right'>${err.name}</div>`;
        });
    },
    signOut() {
      Auth.signOut()
        .then(() => {
          this.$notify("Sign Out Complete");
          const store = getModule(UserStore, this.$store);
          store.setLoggedIn(false);
          this.$emit("set-state", "sign-in");
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
});
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
