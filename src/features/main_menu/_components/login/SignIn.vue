<template>
  <div>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">SIGN IN</v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col lg="6" cols="12">
        <v-text-field v-model="email" label="E-Mail Address" dense outlined hide-details />
        <div>
          <v-fade-transition>
            <a v-if="email" class="fadeSelect" @click="$emit('reverify', email)">
              <i>Have a validation code? Click here.</i>
            </a>
          </v-fade-transition>
        </div>
      </v-col>
      <v-col lg="6" cols="12">
        <v-text-field
          v-model="password"
          label="Password"
          dense
          outlined
          hide-details
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
        />
        <div class="text-right" @click="$emit('set-state', 'reset')">
          <a class="fadeSelect"><i>Forgot Password?</i></a>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" align="start" class="mt-n2 text-center">
      <v-col cols="auto">
        <v-btn
          large
          color="secondary"
          :loading="loading"
          :disabled="!email || !password"
          @click="signIn()"
        >
          Sign In
        </v-btn>
        <br />
        <v-btn small color="accent" class="mt-1" outlined @click="$emit('set-state', 'sign-up')">
          Create Account
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { Auth } from '@aws-amplify/auth'

export default Vue.extend({
  name: 'auth-sign-in',
  data: () => ({
    email: null,
    password: null,
    show: false,
    error: null,
    showError: false,
    loading: false,
  }),
  methods: {
    async signIn() {
      this.loading = true
      const userstore = getModule(UserStore, this.$store)
      Auth.signIn(this.email, this.password)
        .then(user => {
          userstore.setUser(user)
        })
        .then(() => {
          userstore.setAws(userstore.User, 'logIn')
        })
        .then(() => {
          this.$notify('Cloud Data Synchronized', 'success')
          this.loading = false
          this.showError = false
          this.$emit('set-state', 'signed-in')
        })
        .catch(error => {
          this.loading = false
          this.showError = true
          this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
        })
    },
  },
})
</script>
