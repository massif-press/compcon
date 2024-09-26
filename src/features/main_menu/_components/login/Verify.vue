<template>
  <v-container class="text-center">
    <div class="text-center heading" style="letter-spacing: 5px">VERIFY E-MAIL ADDRESS</div>
    <div>
      <div v-if="preFill">A verification code was sent to</div>
      <div v-else>Send a verification code to:</div>
      <v-row dense justify="center" align="center">
        <v-col cols="4">
          <v-text-field v-model="verifyEmail" density="compact" hide-details variant="outlined" />
        </v-col>
      </v-row>
      <v-btn
        :size="preFill ? 'x-small' : 'default'"
        :variant="preFill ? 'tonal' : 'elevated'"
        color="accent"
        :class="preFill ? '' : 'mt-2'"
        style="fade-select"
        @click="resend()">
        {{ preFill ? 'Re-send' : 'Send' }} Verification Code
      </v-btn>
    </div>

    <v-fade-transition>
      <div v-if="preFill">
        <v-divider class="my-2" />
        Input the verification code below to finalize your account
        <v-row dense justify="center">
          <v-col cols="4">
            <v-text-field
              v-model="verify"
              label="Verification Code"
              density="compact"
              variant="outlined"
              class="my-1"
              hide-details />
          </v-col>
        </v-row>
        <v-btn size="large" color="success" :loading="loading" :disabled="!verify" @click="confirm">
          Confirm Verification Code
        </v-btn>
      </div>
    </v-fade-transition>
    <v-btn variant="text" color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
      Cancel
    </v-btn>
    <v-scroll-y-transition leave-absolute hide-on-leave>
      <v-alert
        v-if="error"
        v-model="showError"
        color="error darken-1"
        density="compact"
        prominent
        class="mt-2"
        icon="mdi-alert"
        closable>
        <div class="font-weight-bold">ERROR</div>
        <div v-html="error" />
      </v-alert>
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
          username: this.email,
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
