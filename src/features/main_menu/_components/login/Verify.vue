<template>
  <v-container class="text-center">
    <cc-heading type="h3" center>VERIFY E-MAIL ADDRESS</cc-heading>
    <div class="my-2">
      <div v-if="preFill">A verification code was sent to</div>
      <div v-else>Send a verification code to:</div>
      <v-row dense justify="center" align="center">
        <v-col cols="12" sm="6" lg="4">
          <v-text-field
            v-model="verifyEmail"
            density="compact"
            hide-details
            variant="outlined"
            tile />
        </v-col>
      </v-row>
      <cc-button
        :size="preFill ? 'small' : 'default'"
        color="accent"
        class="mt-2"
        @click="resend()">
        {{ preFill ? 'Re-send' : 'Send' }} Verification Code
      </cc-button>
    </div>

    <v-fade-transition>
      <div v-if="preFill">
        <v-divider class="my-4" />
        Input the verification code to finish creating your account
        <v-row dense justify="center">
          <v-col cols="12" sm="6" lg="4">
            <v-text-field
              v-model="verify"
              label="Verification Code"
              density="compact"
              variant="outlined"
              class="my-1"
              hide-details />
          </v-col>
        </v-row>
        <cc-button
          color="secondary"
          :loading="loading"
          :disabled="!verify"
          class="my-4"
          @click="confirm">
          Confirm Verification Code
        </cc-button>
      </div>
    </v-fade-transition>
    <cc-button variant="text" color="accent" @click="$emit('set-state', 'sign-in')">
      Cancel
    </cc-button>
    <v-scroll-y-transition leave-absolute hide-on-leave>
      <cc-alert
        v-if="error"
        v-model="showError"
        color="error"
        prominent
        icon="mdi-alert"
        closeable
        title="error">
        <div v-html="error" />
      </cc-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script lang="ts">
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

export default {
  name: 'auth-account-verify',
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    error: '',
    showError: false,
    loading: false,
    show: false,
    verify: '',
    verifyEmail: '',
    preFill: false,
    sentCode: false,
  }),
  created() {
    if (this.email) {
      this.verifyEmail = this.email;
      this.preFill = true;
      this.sentCode = true;
    }
  },
  methods: {
    async confirm() {
      this.loading = true;

      try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username: this.verifyEmail,
          confirmationCode: this.verify,
        });

        if (isSignUpComplete) {
          this.loading = false;
          this.$notify('User Account created successfully. Redirecting to Sign-In.');
          this.$emit('set-state', 'sign-in');
        } else {
          this.loading = false;
          this.showError = true;
          this.error = 'Error confirming account. Please try again.';
        }
      } catch (error: any) {
        console.error('error confirming code:', error);
        this.showError = true;
        this.error = error.message;
      }
    },
    async resend() {
      try {
        const res = await resendSignUpCode({ username: this.verifyEmail });

        this.$notify(`New verification e-mail sent to ${this.verifyEmail}`);

        this.sentCode = true;
        this.preFill = true;
      } catch (error: any) {
        console.error('error resending code:', error);
        this.showError = true;
        this.error = error.message;
      }
    },
  },
};
</script>
