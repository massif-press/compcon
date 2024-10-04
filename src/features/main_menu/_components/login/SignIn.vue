<template>
  <v-container class="px-12" style="min-height: 200px">
    <v-fade-transition>
      <div v-if="signingIn" class="flavor-text">
        <v-row no-gutters v-for="l in loginLog">
          <v-col v-html="l.str" />
          <v-col cols="auto">
            <i class="text-caption text-disabled">{{ l.time }}</i>
          </v-col>
        </v-row>
        <v-fade-transition>
          <div v-if="showError">
            <div class="text-right mb-2">
              <v-btn
                size="x-small"
                variant="tonal"
                color="secondary"
                @click="copyLog"
                prepend-icon="mdi-clipboard-text-outline">
                Copy Log
              </v-btn>
            </div>
            <v-row>
              <v-col>
                <v-btn block color="primary" @click="abort">abort</v-btn>
              </v-col>
              <v-col>
                <v-btn block color="primary" @click="retry">retry</v-btn>
              </v-col>
              <v-col>
                <v-btn block color="primary" @click="fail">fail</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-fade-transition>
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="!signingIn">
        <v-row class="mt-1">
          <v-col lg="6" cols="12">
            <v-text-field
              v-model="email"
              label="E-Mail Address"
              density="compact"
              variant="outlined"
              hide-details />
          </v-col>
          <v-col lg="6" cols="12">
            <v-text-field
              v-model="password"
              label="Password"
              density="compact"
              variant="outlined"
              hide-details
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show" />
          </v-col>
        </v-row>
        <div class="text-center mt-2">
          <v-btn
            size="large"
            color="secondary"
            type="submit"
            :loading="loading"
            :disabled="loading || !email || !password"
            @click="signIn">
            Sign In
          </v-btn>
          <div class="mt-2">
            <v-btn
              color="accent"
              class="mx-2"
              variant="outlined"
              @click="$emit('set-state', 'sign-up')">
              Create Account
            </v-btn>
          </div>
        </div>
        <div style="position: absolute; bottom: 6px; left: 6px">
          <v-btn prepend-icon="mdi-email-check" color="accent" @click="$emit('reverify')">
            Verify E-Mail
          </v-btn>
        </div>
        <div style="position: absolute; bottom: 6px; right: 6px">
          <v-btn
            prepend-icon="mdi-lock-reset"
            color="accent"
            @click="$emit('set-state', 'sign-up')">
            Password Recovery
          </v-btn>
        </div>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
import { getUser } from '@/io/apis/account';
import { UserStore } from '@/stores';
// import { Auth } from '@aws-amplify/auth';
import { signIn } from 'aws-amplify/auth';

export default {
  name: 'auth-sign-in',
  data: () => ({
    email: '',
    password: '',
    show: false,
    error: '',
    showError: false,
    loading: false,
    loginLog: [] as { str: string; time: number }[],
    signingIn: false,
  }),
  methods: {
    async signIn() {
      this.signingIn = true;
      await this.addLoginLog('Connecting to COMP/CON authentication service...');

      this.loading = true;
      const userEmail = this.email.trim();
      this.email = userEmail;

      let signInResult;
      si_attempt: try {
        signInResult = await signIn({
          username: userEmail,
          password: this.password,
        });
      } catch (error: any) {
        if (error.name === 'UserAlreadyAuthenticatedException') {
          await this.addLoginLog('Auth service reports user is already signed in', true);
          await this.addLoginLog('Attempting to continue...', true);
          signInResult = { isSignedIn: true };
          break si_attempt;
        }
        this.showError = true;
        await this.addLoginLog('Auth service reports failure to connect', true);
        await this.addLoginLog('Error: ' + error.message, true);
        return;
      }

      if (!signInResult.isSignedIn) {
        this.showError = true;
        await this.addLoginLog('Auth service reports failure to connect', true);
        await this.addLoginLog('Error: sign-in failed', true);
        return;
      }

      await this.addLoginLog('Auth service connection established');

      try {
        await UserStore().setCognito();
        await this.addLoginLog('User credentials verified');
      } catch (error: any) {
        console.error(error);
        this.showError = true;
        await this.addLoginLog('Failed to verify user credentials', true);
        await this.addLoginLog('Error: ' + error.message, true);
        return;
      }

      await this.addLoginLog('Requesting user information...');

      try {
        await UserStore().getUserMetadata();
        await this.addLoginLog('COMP/CON user information received');
        await this.addLoginLog('Retrieving user session...');
      } catch (error: any) {
        this.showError = true;
        await this.addLoginLog('Failed to retrieve user data', true);
        await this.addLoginLog('Error: ' + error.message, true);
        return;
      }

      if (!Object.keys(UserStore().UserMetadata).length) {
        this.showError = true;
        this.error = 'User data not found or could not be created';
        return;
      }

      await this.addLoginLog('Collecting user data...');
      try {
        await UserStore().setMetadataFromDynamo();
        await this.addLoginLog('Updating local metadata...');
      } catch (error: any) {
        this.showError = true;
        await this.addLoginLog('Failed to set metadata', true);
        await this.addLoginLog('Error: ' + error.message, true);
        return;
      }

      await this.addLoginLog('Redirecting to account menu...');

      await setTimeout(() => {}, 2000);

      this.signingIn = false;
      this.$emit('set-state', 'signed-in');
    },
    async addLoginLog(message: string, error = false) {
      const delay = 200;
      let str = `<b>${message}</b>`;
      if (error) str = `<span class="text-error">${str}</span>`;
      this.loginLog.push({ str, time: Date.now() });
      return new Promise((r) => setTimeout(r, delay));
    },
    emailValid() {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email);
    },
    copyLog() {
      let log = this.loginLog.map((x) => `${x.str} / ${x.time}`).join('\n');
      log = log.replace(/<[^>]*>?/gm, '');
      navigator.clipboard.writeText(log);
    },
    abort() {
      this.reset();
      this.signingIn = false;
    },
    retry() {
      this.reset();
      this.signIn();
    },
    fail() {
      this.reset();
      this.$emit('close');
    },
    reset() {
      this.signingIn = false;
      this.showError = false;
      this.loading = false;
      this.loginLog = [];
    },
  },
};
</script>
