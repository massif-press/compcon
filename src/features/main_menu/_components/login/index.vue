<template>
  <div>
    <v-slide-x-transition group leave-absolute>
      <sign-in
        v-if="state === 'sign-in'"
        @set-state="state = $event"
        @reverify="verifyFlow($event)" />
      <password-reset v-else-if="state === 'reset'" @set-state="state = $event" />
      <sign-up
        v-else-if="state === 'sign-up'"
        :oauth-code="oauthCode"
        @set-state="state = $event"
        @success="verifyFlow($event)" />
      <verify v-else-if="state === 'verify'" :email="email" @set-state="state = $event" />
      <signed-in v-else-if="state === 'signed-in'" :email="email" @set-state="state = $event" />
    </v-slide-x-transition>
  </div>
</template>

<script lang="ts">
import SignIn from './SignIn.vue';
import PasswordReset from './PasswordReset.vue';
import SignUp from './SignUp.vue';
import Verify from './Verify.vue';
import SignedIn from './SignedIn.vue';
// import { Auth } from '@aws-amplify/auth';
import { UserStore } from '@/stores';

export default {
  name: 'login-auth',
  components: { SignIn, PasswordReset, SignUp, Verify, SignedIn },
  data: () => ({
    state: 'sign-in',
    email: null,
    currentAuthedUser: null,
    oauthCode: null,
  }),
  async created() {
    await this.getAuthedUser();
    // const userstore =UserStore();
    // if (userstore.IsPatron) {
    //   this.state = 'sign-up';
    // }
  },
  methods: {
    verifyFlow(email) {
      this.email = email;
      this.state = 'verify';
    },
    async getAuthedUser() {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          this.currentAuthedUser = user;
          this.state = 'signed-in';
        })
        .catch(() => {
          this.currentAuthedUser = null;
        });
    },
  },
};
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
