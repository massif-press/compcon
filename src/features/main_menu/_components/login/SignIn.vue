<template>
  <v-container>
    <v-fade-transition>
      <div v-if="signingIn"
        class="flavor-text">
        <div role="status"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Sign-in progress log">
          <v-row v-for="(l, lIdx) in loginLog"
            :key="`log-${lIdx}`"
            no-gutters>
            <v-col v-html-safe="l.str"
              cols="12"
              md="" />
            <v-col cols="12"
              md="auto">
              <i class="text-caption text-disabled ml-3">{{ l.time }}</i>
            </v-col>
          </v-row>
        </div>
        <v-fade-transition>
          <div v-if="showError"
            role="alert">
            <div class="text-right mb-2">
              <v-btn size="x-small"
                variant="tonal"
                color="secondary"
                prepend-icon="mdi-clipboard-text-outline"
                @click="copyLog">
                {{ $t('mainMenu.auth.copyLog') }}
              </v-btn>
            </div>
            <v-row dense>
              <v-col>
                <cc-button variant="tonal"
                  block
                  color="primary"
                  aria-label="Abort sign-in"
                  @click="abort">{{ $t('mainMenu.auth.abort') }}</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal"
                  block
                  color="primary"
                  aria-label="Retry sign-in"
                  @click="retry">{{ $t('mainMenu.auth.retry') }}</cc-button>
              </v-col>
              <v-col>
                <cc-button variant="tonal"
                  block
                  color="primary"
                  aria-label="Cancel and close"
                  @click="fail">{{ $t('common.cancel') }}</cc-button>
              </v-col>
            </v-row>
          </div>
        </v-fade-transition>
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="!signingIn">
        <form aria-label="Sign in"
          @submit.prevent="signIn">
          <v-row class="mt-1">
            <v-col lg="6"
              cols="12">
              <div class="text-cc-overline pl-3"
                aria-hidden="true">{{ $t('mainMenu.auth.email') }}</div>
              <cc-text-field v-model="email"
                icon="mdi-email-outline"
                color="primary"
                variant="outlined"
                type="email"
                autocomplete="email"
                aria-label="E-Mail" />
            </v-col>
            <v-col lg="6"
              cols="12">
              <div class="text-cc-overline pl-3"
                aria-hidden="true">{{ $t('mainMenu.auth.password') }}</div>
              <cc-text-field v-model="password"
                icon="mdi-lock-outline"
                color="primary"
                variant="outlined"
                :type="show ? 'text' : 'password'"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                autocomplete="current-password"
                aria-label="Password"
                :append-inner-aria-label="show ? 'Hide password' : 'Show password'"
                @click-append-inner="show = !show" />
            </v-col>
          </v-row>
          <div class="text-center mt-4">
            <cc-button size="large"
              block
              color="secondary"
              type="submit"
              :loading="loading"
              :disabled="loading || !email || !password"
              :aria-busy="loading"
              @click="signIn">
              {{ $t('mainMenu.auth.signIn') }}
            </cc-button>
            <cc-button color="accent"
              size="small"
              block
              class="mt-2"
              variant="outlined"
              @click="$emit('set-state', 'sign-up')">
              {{ $t('mainMenu.auth.createAccount') }}
            </cc-button>
          </div>
        </form>
        <v-footer style="position: absolute; bottom: 0; left: 0; right: 0">
          <cc-button :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-email-check"
            color="primary"
            @click="$emit('reverify', $event)">
            {{ $t('mainMenu.auth.verifyEmail') }}
          </cc-button>
          <v-spacer />
          <cc-button :size="mobile ? 'small' : 'default'"
            :stacked="mobile"
            prepend-icon="mdi-lock-reset"
            color="primary"
            @click="$emit('set-state', 'reset')">
            {{ $t('mainMenu.auth.passwordRecovery') }}
          </cc-button>
        </v-footer>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { signIn as amplifySignIn } from 'aws-amplify/auth';

const _display = useDisplay()

const emit = defineEmits<{
  'close': []
  'set-state': [any]
  'reverify': [any]
}>()

const email = ref('')
const password = ref('')
const show = ref(false)
const error = ref('')
const showError = ref(false)
const loading = ref(false)
const loginLog = ref([] as { str: string; time: number }[])
const signingIn = ref(false)

const mobile = computed(() => {
  return _display.mdAndDown.value;
})

async function signIn() {
  signingIn.value = true;
  await addLoginLog('Connecting to COMP/CON authentication service...');

  loading.value = true;
  const emailTrimmed = email.value.trim();
  const userEmail = emailTrimmed.toLowerCase();
  email.value = userEmail;

  let signInResult;
  si_attempt: try {
    try {
      signInResult = await amplifySignIn({ username: userEmail, password: password.value });
    } catch (firstError: any) {
      if (firstError.name === 'UserAlreadyAuthenticatedException') throw firstError;
      // fall back to original casing for accounts registered before email normalization
      if (userEmail !== emailTrimmed) {
        signInResult = await amplifySignIn({ username: emailTrimmed, password: password.value });
      } else {
        throw firstError;
      }
    }
  } catch (error: any) {
    if (error.name === 'UserAlreadyAuthenticatedException') {
      await addLoginLog('Auth service reports user is already signed in', true);
      await addLoginLog('Attempting to continue...', true);
      signInResult = { isSignedIn: true };
      break si_attempt;
    }
    showError.value = true;
    await addLoginLog('Auth service reports failure to connect', true);
    await addLoginLog('Error: ' + error.message, true);
    return;
  }

  if (!signInResult.isSignedIn) {
    showError.value = true;
    await addLoginLog('Auth service reports failure to connect', true);
    await addLoginLog('Error: sign-in failed', true);
    return;
  }

  await addLoginLog('Auth service connection established');

  try {
    await UserStore().setCognito();
    await addLoginLog('User credentials verified');
  } catch (error: any) {
    logger.error(`Error verifying user credentials: ${error}`, {}, error);
    showError.value = true;
    await addLoginLog('Failed to verify user credentials', true);
    await addLoginLog('Error: ' + error.message, true);
    return;
  }

  await addLoginLog('Requesting user information...');

  try {
    await UserStore().getUserMetadata();
    await addLoginLog('COMP/CON user information received');
    await addLoginLog('Retrieving user session...');
  } catch (error: any) {
    showError.value = true;
    await addLoginLog('Failed to retrieve user data', true);
    await addLoginLog('Error: ' + error.message, true);
    return;
  }

  if (!Object.keys(UserStore().UserMetadata).length) {
    showError.value = true;
    error.value = 'User data not found or could not be created';
    return;
  }

  await addLoginLog('Collecting user data...');
  try {
    await UserStore().setMetadataFromDynamo();
    await addLoginLog('Updating local metadata...');
  } catch (error: any) {
    showError.value = true;
    await addLoginLog('Failed to set metadata', true);
    await addLoginLog('Error: ' + error.message, true);
    return;
  }

  await UserStore().checkV2CloudMigration();

  await addLoginLog('Redirecting to account menu...');

  await setTimeout(() => { }, 2000);

  signingIn.value = false;
  emit('set-state', 'signed-in');
}
async function addLoginLog(message: string, error = false) {
  const delay = 200;
  let str = `<b>${message}</b>`;
  if (error) str = `<span class="text-error">${str}</span>`;
  loginLog.value.push({ str, time: Date.now() });
  return new Promise((r) => setTimeout(r, delay));
}

function copyLog() {
  let log = loginLog.value.map((x) => `${x.str} / ${x.time}`).join('\n');
  log = log.replace(/<[^>]*>?/gm, '');
  navigator.clipboard.writeText(log);
}
function abort() {
  reset();
  signingIn.value = false;
}
function retry() {
  reset();
  signIn();
}
function fail() {
  reset();
  emit('close');
}
function reset() {
  signingIn.value = false;
  showError.value = false;
  loading.value = false;
  loginLog.value = [];
}
</script>
