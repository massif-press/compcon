<template>
  <v-container>
    <v-alert outlined prominent icon="mdi-information-outline" class="my-2">
      <div><b>Cloud Account</b></div>
      <!-- <div>
        COMP/CON cloud storage accounts are an upcoming feature that is currently in development.
        They allow for storage and syncing of COMP/CON data across multiple devices with minimal
        hassle. For the time being, they are restricted to
        <a href="https://www.patreon.com/compcon" target="_blank">Patreon supporters</a>
        while we try to determine storage requirements and get an idea of what operating costs might
        look like.
      </div> -->
      <div>
        The e-mail address input below will be used to send you a confirmation code to finalize the
        creation of your account. From there, your e-mail will only be used to log in to your
        COMP/CON account. We are committed to keeping your e-mail address confidential. We do not
        sell, rent, or lease our contact data or lists to third parties, and we will not provide
        your personal information to any third party individual, government agency, or company at
        any time.
      </div>
    </v-alert>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">CREATE ACCOUNT</v-col>
    </v-row>
    <div v-if="isPatron" class="mt-2 heading h3 accent--text text-center">
      <v-icon large color="success">mdi-patreon</v-icon>
      Patreon Account Connected: {{ patreonAuthCode }}
      <v-icon large color="success">mdi-check</v-icon>
    </div>
    <div v-else>
      <v-row no-gutters justify="center" align="center" class="mt-2">
        <v-btn x-large color="patreon" dark @click="verifyPatreon">
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
    <div>
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
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <v-btn
            large
            color="secondary"
            :loading="loading"
            :disabled="!email || !password || !isPatron"
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
// import { loginUrl } from '@/cloud/patreon'
import { UserStore } from '@/store'
import { getModule } from 'vuex-module-decorators'
import popupOauth from '@/cloud/oauth2-popup'

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
    patreonAuthCode: '',
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 6 || 'Min 6 characters',
      emailMatch: v =>
        !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
    },
  }),
  computed: {
    isPatron() {
      //       return true
      //       // const userstore = getModule(UserStore, this.$store)
      //       // return userstore.IsPatron
      //     },
      //     patreonLoginUrl() {
      //       return ''
      //       // return loginUrl()
      return !!this.patreonAuthCode
      // const cloudstore = getModule(CloudStore, this.$store)
      // return cloudstore.IsPatron
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
          },
        })
        this.loading = false
        // this.$notify('Account creation successful. E-mail verification sent.')
        this.showError = false
        this.$emit('success', this.email)
        const userstore = getModule(UserStore, this.$store)
        userstore.clearOauth()
      } catch (error) {
        console.log('error signing up:', error)
        this.loading = false
        this.showError = true
        this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
      }
    },
    async verifyPatreon() {
      const authorizationCode = await popupOauth(
        'https://www.patreon.com/oauth2/authorize',
        '_1O6Z4dBszp3Q9ERr93RVNCwM1VUveu9xI5vq1DqJUXEK47FC7MkTtF1lwT5_ko3',
        'http://localhost:8080/patreon-callback',
        '',
        'code'
      )
      console.log(authorizationCode)
      this.patreonAuthCode = authorizationCode
    },
  },
})
</script>
