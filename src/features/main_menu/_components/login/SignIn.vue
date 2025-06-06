<template>
  <v-container>
    <v-fade-transition>
      <div v-if="signingIn" class="flavor-text">
        <v-row no-gutters v-for="l in loginLog">
          <v-col cols="12" md="" v-html="l.str" />
          <v-col cols="12" md="auto">
            <i class="text-caption text-disabled ml-3">{{ l.time }}</i>
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
            <v-row dense>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="abort">abort</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="retry">retry</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal" block color="primary" @click="fail">fail</cc-button>
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
        <div class="text-center mt-4">
          <cc-button
            size="large"
            block
            color="secondary"
            type="submit"
            :loading="loading"
            :disabled="loading || !email || !password"
            @click="signIn">
            Sign In
          </cc-button>
          <cc-button
            color="accent"
            size="small"
            block
            class="mt-2"
            variant="outlined"
            @click="$emit('set-state', 'sign-up')">
            Create Account
          </cc-button>
        </div>
        <v-footer style="position: absolute; bottom: 0; left: 0; right: 0">
          <cc-button
            :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-email-check"
            color="primary"
            @click="$emit('reverify')">
            Verify E-Mail
          </cc-button>
          <v-spacer />
          <cc-button
            :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-lock-reset"
            color="primary"
            @click="$emit('set-state', 'reset')">
            Password Recovery
          </cc-button>
        </v-footer>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import logger from '@/user/logger';
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
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
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
        logger.error(`Error verifying user credentials: ${error}`, this);
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
