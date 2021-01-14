<template>
  <v-container>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">CREATE ACCOUNT</v-col>
    </v-row>
    <div v-if="isPatron" class="mt-2 heading h3 accent--text text-center">
      <v-icon large color="success">mdi-patreon</v-icon>
      Patreon Account Connected
      <v-icon large color="success">mdi-check</v-icon>
    </div>
    <div v-else>
      <v-row no-gutters justify="center" align="center" class="mt-2">
        <v-btn x-large color="#f96854" dark :href="patreonLoginUrl()" target="_blank">
          <v-icon left>mdi-patreon</v-icon>
          Link Patreon Account
        </v-btn>
      </v-row>
      <div class="text-center mt-2">
        <i>
          While this feature is in development, you must first authenticate your Patreon account to
          register a new COMP/CON cloud account.
        </i>
      </div>
    </div>
    <div v-if="isPatron">
      <v-row justify="center" align="center">
        <v-col lg="4" cols="12">
          <v-text-field
            v-model="email"
            label="E-Mail Address"
            :rules="[rules.required, rules.emailMatch]"
            solo
          />
        </v-col>
        <v-col lg="4" cols="12">
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            solo
            :rules="[rules.required, rules.min]"
            @click:append="show = !show"
          />
        </v-col>
        <!-- <v-col lg="4" cols="12">
          <v-text-field
            v-model="invite"
            label="Invitation Code"
            type="text"
            solo
            @click:append="show = !show"
          />
        </v-col> -->
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <v-btn
            large
            color="secondary"
            :loading="loading"
            :disabled="!email || !password || !invite"
            @click="createAccount"
          >
            submit
          </v-btn>
          <br />
          <v-btn text color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </div>
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Auth } from '@aws-amplify/auth'
import { loginUrl } from '@/cloud/patreon'
import { CloudStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'sign-up',
  // components: { Auth },
  data: () => ({
    showError: false,
    error: '',
    loading: false,
    show: false,
    email: '',
    password: '',
    invite: '',
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 6 || 'Min 6 characters',
      emailMatch: v =>
        !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
    },
  }),
  computed: {
    isPatron() {
      const cloudstore = getModule(CloudStore, this.$store)
      return cloudstore.IsPatron
    },
    patreonLoginUrl() {
      return loginUrl
    },
  },
  created() {
    // console.log(aws)
  },
  methods: {
    async createAccount() {
      this.loading = true
      try {
        const { user } = await Auth.signUp({
          username: this.email,
          password: this.password,
          attributes: {
            email: this.email,
            'custom:access_code': 'ccjan21',
          },
        })
        this.loading = false
        // this.$notify('Account creation successful. E-mail verification sent.')
        console.log(user)
        this.showError = false
        this.$emit('success', this.email)
        const cloudstore = getModule(CloudStore, this.$store)
        cloudstore.clearOauth()
      } catch (error) {
        console.log('error signing up:', error)
        this.loading = false
        this.showError = true
        this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
      }
    },
  },
})
</script>
