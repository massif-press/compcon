<template>
  <v-container class="text-center">
    <cc-heading type="h3" center>{{ $t('mainMenu.auth.verifyEmailTitle') }}</cc-heading>
    <div class="my-2">
      <div v-if="preFill">{{ $t('mainMenu.auth.codeSentToLabel') }}</div>
      <div v-else>{{ $t('mainMenu.auth.sendCodeToLabel') }}</div>
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
      <div class="d-flex align-center justify-center">
        <cc-button
          :size="preFill ? 'small' : 'default'"
          color="accent"
          class="mt-2"
          @click="resend()">
          {{ preFill ? $t('mainMenu.auth.resendVerificationCode') : $t('mainMenu.auth.sendVerificationCode') }}
        </cc-button>
      </div>
      <v-fade-transition>
        <div v-if="!preFill" class="text-center mt-1">
          <v-btn size="x-small" flat tile :disabled="!verifyEmail" @click="preFill = true">
            {{ $t('mainMenu.auth.alreadyHaveCode') }}
          </v-btn>
        </div>
      </v-fade-transition>
    </div>

    <v-fade-transition>
      <div v-if="preFill">
        <v-divider class="my-4" />
        {{ $t('mainMenu.auth.inputCodeToFinish') }}
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
        <div class="d-flex align-center justify-center">
          <cc-button
            color="secondary"
            :loading="loading"
            :disabled="!verify || !verifyEmail"
            class="my-4"
            @click="confirm">
            {{ $t('mainMenu.auth.confirmVerificationCode') }}
          </cc-button>
        </div>
      </div>
    </v-fade-transition>
    <cc-button variant="text" color="accent" @click="$emit('set-state', 'sign-in')">
      {{ $t('common.cancel') }}
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
        <div v-html-safe="error" />
      </cc-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref } from 'vue'
import { notify } from '@/util/notify'
import logger from '@/user/logger';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

defineOptions({ name: 'auth-account-verify' })

const props = defineProps<{
  email: string
}>()

const emit = defineEmits<{
  'set-state': []
}>()

const error = ref('')
const showError = ref(false)
const loading = ref(false)
const show = ref(false)
const verify = ref('')
const verifyEmail = ref('')
const preFill = ref(false)
const sentCode = ref(false)

if (props.email) {
      verifyEmail.value = props.email;
      preFill.value = true;
      sentCode.value = true;
    }

async function confirm() {
      loading.value = true;

      try {
        const userEmail = verifyEmail.value.trim().toLowerCase();
        verifyEmail.value = userEmail;

        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username: userEmail,
          confirmationCode: verify.value,
        });

        if (isSignUpComplete) {
          loading.value = false;
          notify(t('mainMenu.auth.accountCreated'));
          emit('set-state', 'sign-in');
        } else {
          loading.value = false;
          showError.value = true;
          error.value = 'Error confirming account. Please try again.';
        }
      } catch (error: any) {
        logger.error(`error confirming sign up: ${error}`, this);
        showError.value = true;
        error.value = error.message;
      }
    }
async function resend() {
      try {
        const userEmail = verifyEmail.value.trim().toLowerCase();
        verifyEmail.value = userEmail;

        const res = await resendSignUpCode({ username: userEmail });

        notify(t('mainMenu.auth.verificationSent', { email: userEmail }));

        sentCode.value = true;
        preFill.value = true;
      } catch (error: any) {
        logger.error(`error resending code: ${error}`, this, error);
        showError.value = true;
        error.value = error.message;
      }
    }
</script>
