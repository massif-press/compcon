<template>
  <div>
    <cc-heading type="h3" center class="my-3">Reset Password</cc-heading>
    <v-row justify="center">
      <v-col lg="6" cols="12">
        <cc-text-field v-model="email" label="E-Mail Address" color="primary" />
      </v-col>
    </v-row>
    <div class="mt-4 text-center">
      <cc-button color="secondary" :disabled="!email" :loading="loading" @click="reset()">
        Send Password Reset E-Mail
      </cc-button>
    </div>
    <v-slide-x-transition>
      <v-card-text v-if="sent">
        <v-divider class="mb-4" />
        <cc-heading center type="h3" dense class="my-4">
          Password reset code sent to {{ email }}
        </cc-heading>
        <v-row align="center" justify="center">
          <v-col lg="4" cols="12">
            <cc-text-field v-model="code" color="primary" label="Password Reset Code" />
          </v-col>
          <v-col lg="6" cols="12">
            <cc-text-field
              v-model="newPass"
              color="primary"
              label="New Password"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="[rules.passLength]"
              @click-append-icon="show = !show" />
          </v-col>
        </v-row>
        <div class="mt-4 text-center">
          <cc-button
            color="secondary"
            :disabled="!email || !newPass"
            :loading="loading"
            @click="setNewPassword()">
            Set New Password
          </cc-button>
        </div>
      </v-card-text>
    </v-slide-x-transition>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn variant="text" color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  resetPassword,
  type ResetPasswordOutput,
  confirmResetPassword,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';

async function handleResetPassword(username: string) {
  try {
    const output = await resetPassword({ username });
    handleResetPasswordNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
  const { nextStep } = output;
  switch (nextStep.resetPasswordStep) {
    case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(`Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`);
      // Collect the confirmation code from the user and pass to confirmResetPassword.
      break;
    case 'DONE':
      console.log('Successfully reset password.');
      break;
  }
}

async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword,
}: ConfirmResetPasswordInput) {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
  } catch (error) {
    console.log(error);
  }
}

export default {
  name: 'auth-password-reset',
  data: () => ({
    loading: false,
    sent: false,
    email: '',
    show: false,
    newPass: '',
    code: '',
    rules: {
      passLength: (v) => (v && v.length >= 6) || 'Minimum 6 characters',
    },
  }),
  methods: {
    reset() {
      this.loading = true;
      handleResetPassword(this.email)
        .then((data) => {
          this.loading = false;
          this.sent = true;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
          this.sent = false;
          this.$notify(`Unable to send reset e-mail: ${err.message}`, 'error');
        });
    },
    setNewPassword() {
      this.loading = true;
      handleConfirmResetPassword({
        username: this.email,
        confirmationCode: this.code,
        newPassword: this.newPass,
      })
        .then((data) => {
          this.loading = false;
          this.$notify({
            icon: 'mdi-check',
            color: 'success',
            title: 'Success',
            text: 'Password changed successfully.',
          });
          this.$emit('set-state', 'sign-in');
        })
        .catch((err) => {
          this.$notify(`Unable to change password: ${err.message}`, 'error');
          this.loading = false;
        });
    },
  },
};
</script>
