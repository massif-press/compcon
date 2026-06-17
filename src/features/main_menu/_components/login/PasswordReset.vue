<template>
  <div>
    <cc-heading type="h3"
      center
      class="my-3">{{ $t('mainMenu.auth.resetPassword') }}</cc-heading>
    <v-row justify="center">
      <v-col lg="6"
        cols="12">
        <cc-text-field v-model="email"
          :label="$t('mainMenu.fields.emailAddress')"
          color="primary" />
      </v-col>
    </v-row>
    <div class="mt-4 text-center">
      <cc-button color="secondary"
        :disabled="!email"
        :loading="loading"
        @click="reset()">
        {{ $t('mainMenu.auth.sendPasswordResetEmail') }}
      </cc-button>
    </div>
    <v-slide-x-transition>
      <v-card-text v-if="sent">
        <v-divider class="mb-4" />
        <cc-heading center
          type="h3"
          dense
          class="my-4">
          {{ $t('mainMenu.auth.resetCodeSentTo', { email }) }}
        </cc-heading>
        <v-row align="center"
          justify="center">
          <v-col lg="4"
            cols="12">
            <cc-text-field v-model="code"
              color="primary"
              :label="$t('mainMenu.fields.passwordResetCode')" />
          </v-col>
          <v-col lg="6"
            cols="12">
            <cc-text-field v-model="newPass"
              color="primary"
              :label="$t('mainMenu.fields.newPassword')"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="[rules.passLength]"
              @click-append-icon="show = !show" />
          </v-col>
        </v-row>
        <div class="mt-4 text-center">
          <cc-button color="secondary"
            :disabled="!email || !newPass"
            :loading="loading"
            @click="setNewPassword()">
            {{ $t('mainMenu.auth.setNewPassword') }}
          </cc-button>
        </div>
      </v-card-text>
    </v-slide-x-transition>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn variant="text"
          color="accent"
          class="mt-1"
          @click="$emit('set-state', 'sign-in')">
          {{ $t('common.cancel') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref } from 'vue'
import { notify } from '@/util/notify'
import logger from '@/user/logger';
import {
  resetPassword,
  type ResetPasswordOutput,
  confirmResetPassword,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
async function handleResetPassword(username: string) {
  const output = await resetPassword({ username });
  handleResetPasswordNextSteps(output);
  return username;
}
function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
  const { nextStep } = output;
  switch (nextStep.resetPasswordStep) {
    case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      logger.info(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
      break;
    case 'DONE':
      logger.info('Successfully reset password.');
      break;
  }
}
async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput) {
  await confirmResetPassword({ username, confirmationCode, newPassword });
}

defineOptions({ name: 'auth-password-reset' })

const emit = defineEmits<{
  'set-state': []
}>()

const loading = ref(false)
const sent = ref(false)
const email = ref('')
const resetUsername = ref('')
const show = ref(false)
const newPass = ref('')
const code = ref('')
const rules = ref({
  passLength: (v) => (v && v.length >= 6) || 'Minimum 6 characters',
})

function reset() {
  loading.value = true;
  // cognito usernames are case sensitive. legacy accounts may have been created 
  // with their original casing, so try the normalized address first. Whichever 
  // one succeeds is persisted in resetUsername for the confirmation step.
  const emailTrimmed = email.value.trim();
  const emailLower = emailTrimmed.toLowerCase();
  handleResetPassword(emailLower)
    .catch((err) => {
      if (emailLower !== emailTrimmed) return handleResetPassword(emailTrimmed);
      throw err;
    })
    .then((username) => {
      resetUsername.value = username;
      loading.value = false;
      sent.value = true;
    })
    .catch((err) => {
      logger.error(`Error sending reset password email: ${err}`, this, err);
      loading.value = false;
      sent.value = false;
      notify(t('mainMenu.auth.passwordResetErrorText', { msg: err.message }), 'error');
    });
}
function setNewPassword() {
  loading.value = true;
  handleConfirmResetPassword({
    username: resetUsername.value || email.value.trim().toLowerCase(),
    confirmationCode: code.value,
    newPassword: newPass.value,
  })
    .then((data) => {
      loading.value = false;
      notify({
        icon: 'mdi-check',
        color: 'success',
        title: t('notify.common.success'),
        text: t('mainMenu.auth.passwordChangedText'),
      });
      emit('set-state', 'sign-in');
    })
    .catch((err) => {
      notify(t('mainMenu.auth.passwordChangeErrorText', { msg: err.message }), 'error');
      loading.value = false;
    });
}
</script>
