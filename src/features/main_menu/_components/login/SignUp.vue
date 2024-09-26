<template>
  <v-container>
    <v-alert
      variant="outlined"
      border="start"
      border-color="secondary"
      color="secondary"
      prominent
      icon="mdi-information-outline">
      <div class="heading h3 text-text">COMP/CON Cloud Account</div>
      <div class="text-caption text-text">
        The e-mail address input below will be used to send you a confirmation code to finalize the
        creation of your account. From there, your e-mail will only be used to log in to your
        COMP/CON account. We are committed to keeping your e-mail address confidential. We do not
        sell, rent, or lease contact data or lists to third parties, and we will never provide your
        personal information to any third party individual, government agency, or company at any
        time, for any reason.
      </div>
    </v-alert>
    <div class="text-center mt-2">
      <b style="letter-spacing: 5px">CREATE ACCOUNT</b>
    </div>

    <div class="mt-2">
      <v-row justify="center" align="center">
        <v-col lg="4" cols="12">
          <v-text-field
            v-model="email"
            label="E-Mail Address"
            :rules="[rules.required, rules.emailMatch]"
            solo />
        </v-col>
        <v-col lg="4" cols="12">
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            solo
            :rules="[rules.required, rules.min]"
            @click:append="show = !show" />
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <v-btn
            large
            color="secondary"
            type="submit"
            :loading="loading"
            :disabled="!submitOk"
            @click="createAccount">
            submit
          </v-btn>
          <br />
          <v-btn variant="text" color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
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
        !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) || 'E-mail must be valid',
    },
  }),
  computed: {
    submitOk() {
      return (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(this.email) && this.password.length >= 6
      );
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
        console.error('error signing up:', error);
        this.loading = false;
        this.showError = true;
        this.error = error.message;
      }
    },
  },
};
</script>
