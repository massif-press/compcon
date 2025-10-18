<template>
  <v-container>
    <cc-alert
      color="secondary"
      prominent
      icon="mdi-information-outline"
      title="COMP/CON Cloud Account">
      <div class="text-caption text-text">
        The e-mail address input below will be used to send you a confirmation code to finalize the
        creation of your account. From there, your e-mail will only be used to log in to your
        COMP/CON account.
        <br />
        We are committed to keeping your e-mail address confidential. We do not sell, rent, or lease
        contact data or lists to third parties, and we will never provide your personal information
        to any third party individual, government agency, or company at any time, for any reason.
      </div>
    </cc-alert>
    <cc-heading type="h3" center class="my-2">Create Account</cc-heading>

    <div class="my-4">
      <v-row justify="center" align="center">
        <v-col lg="6" cols="12">
          <div class="text-cc-overline pl-3">E-Mail</div>
          <cc-text-field
            v-model="email"
            icon="mdi-email-outline"
            color="primary"
            variant="outlined" />
        </v-col>
        <v-col lg="6" cols="12">
          <div class="text-cc-overline pl-3">Password</div>
          <cc-text-field
            v-model="password"
            icon="mdi-lock-outline"
            color="primary"
            variant="outlined"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click-append-inner="show = !show" />
        </v-col>
      </v-row>
      <br />
      <cc-button
        block
        size="small"
        color="secondary"
        type="submit"
        class="my-6"
        :loading="loading"
        :disabled="!submitOk"
        @click="createAccount">
        submit
      </cc-button>
      <cc-button variant="text" color="error" @click="$emit('set-state', 'sign-in')">
        Cancel
      </cc-button>
    </div>

    <v-scroll-y-transition leave-absolute hide-on-leave>
      <v-alert
        v-if="error"
        v-model="showError"
        color="error darken-1"
        density="compact"
        class="mt-2"
        icon="mdi-alert"
        closeable
        prominent>
        <div class="font-weight-bold">ERROR</div>
        <div v-html="error" />
      </v-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script lang="ts">
import logger from '@/user/logger';
import { signUp } from 'aws-amplify/auth';

export default {
  name: 'sign-up',
  data: () => ({
    showError: false,
    error: '',
    loading: false,
    show: false,
    email: '',
    password: '',
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 6 || 'Min 6 characters',
      emailMatch: (v) =>
        !v ||
        /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) ||
        'E-mail must be valid',
    },
  }),
  computed: {
    submitOk() {
      return (
        /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(this.email) &&
        this.password.length >= 6
      );
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    async createAccount() {
      this.loading = true;
      try {
        const userEmail = this.email;
        this.email = userEmail;

        await signUp({
          username: userEmail,
          password: this.password,
          options: {
            userAttributes: {
              email: userEmail,
            },
          },
        });

        this.loading = false;
        this.showError = false;
        this.$emit('success', userEmail);
      } catch (error: any) {
        logger.error(`Error creating account: ${error}`, this, error);
        this.loading = false;
        this.showError = true;
        this.error = error.message;
      }
    },
  },
};
</script>
