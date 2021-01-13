<template>
  <div>
    <v-alert outlined prominent icon="mdi-information-outline" class="my-2">
      <div><b>Cloud Account</b></div>
      <div>
        COMP/CON cloud storage accounts are an upcoming feature that is currently in development.
        They allow for storage and syncing of COMP/CON data across multiple devices with minimal
        hassle. For the time being, they are restricted to
        <a href="https://www.patreon.com/compcon" target="_blank">Patreon supporters</a>
        while we try to determine storage requirements and get an idea of what operating costs might
        look like.
      </div>
    </v-alert>
    <v-slide-x-transition group leave-absolute>
      <sign-in v-if="state === 'sign-in'" :key="'auth-signin'" @set-state="state = $event" />
      <password-reset
        v-else-if="state === 'reset'"
        :key="'auth-reset'"
        @set-state="state = $event"
      />
      <sign-up
        v-else-if="state === 'sign-up'"
        :key="'auth-signup'"
        :oauth-state="oauthState"
        :oauth-code="oauthCode"
        @set-state="state = $event"
        @success="verifyFlow($event)"
      />
      <verify
        v-else-if="state === 'verify'"
        :key="'auth-verify'"
        :email="email"
        @set-state="state = $event"
      />
      <signed-in
        v-else-if="state === 'signed-in'"
        :key="'auth-signedin'"
        :email="email"
        @set-state="state = $event"
        @reverify="verifyFlow($event)"
      />
    </v-slide-x-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SignIn from './SignIn.vue'
import PasswordReset from './PasswordReset.vue'
import SignUp from './SignUp.vue'
import Verify from './Verify.vue'
import SignedIn from './SignedIn.vue'
import { Auth } from '@aws-amplify/auth'
import { CloudStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'login-auth',
  components: { SignIn, PasswordReset, SignUp, Verify, SignedIn },
  data: () => ({
    state: 'sign-in',
    email: null,
    currentAuthedUser: null,
    oauthState: null,
    oauthCode: null,
  }),
  async mounted() {
    await this.getAuthedUser()
    const cloudstore = getModule(CloudStore, this.$store)
    if (cloudstore.IsPatron) {
      this.state = 'sign-up'
    }
  },
  methods: {
    verifyFlow(email) {
      this.email = email
      this.state = 'verify'
    },
    async getAuthedUser() {
      Auth.currentAuthenticatedUser()
        .then(user => {
          console.log(user)
          this.currentAuthedUser = user
          this.state = 'signed-in'
        })
        .catch(() => {
          this.currentAuthedUser = null
        })
    },
  },
})
</script>

<style>
amplify-authenticator {
  display: block;
  justify-content: center;
  align-items: center;
  flex: 0;
  --container-height: 200px;
}
</style>
