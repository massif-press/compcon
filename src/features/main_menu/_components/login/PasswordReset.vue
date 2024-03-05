<template>
  <div>
    <v-row density="compact" class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">RESET PASSWORD</v-col>
    </v-row>
    <v-row class="mt-2" justify="center">
      <v-col lg="6" cols="12">
        <v-text-field
          v-model="email"
          variant="outlined"
          density="compact"
          label="E-Mail Address"
          hide-details />
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" align="start" class="mt-n2 text-center">
      <v-col cols="auto">
        <v-btn color="secondary" :disabled="!email" :loading="loading" @click="reset()">
          Send Password Reset E-Mail
        </v-btn>
      </v-col>
    </v-row>
    <v-slide-x-transition group>
      <v-row v-if="sent" key="a">
        <v-col cols="12" class="text-center body-text text-stark">
          <div>Password reset code sent to {{ email }}</div>
        </v-col>
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="code"
            variant="outlined"
            density="compact"
            label="Password Reset Code" />
        </v-col>
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="newpass"
            variant="outlined"
            density="compact"
            label="New Password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            :rules="[rules.passLength]"
            @click:append="show = !show" />
        </v-col>
      </v-row>
      <v-row v-if="sent" key="b" no-gutters justify="end" class="mt-n2">
        <v-col cols="auto">
          <v-btn
            text
            color="primary"
            :loading="loading"
            :disabled="!newpass"
            @click="setNewPassword()">
            submit
          </v-btn>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn text color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
// import { Auth } from '@aws-amplify/auth';

export default {
  name: 'auth-password-reset',
  data: () => ({
    loading: false,
    sent: false,
    email: null,
    show: false,
    oldpass: null,
    newpass: null,
    resetpass: null,
    code: null,
    rules: {
      passLength: (v) => (v && v.length >= 6) || 'Minimum 6 characters',
    },
  }),
  methods: {
    reset() {
      this.loading = true;
      Auth.forgotPassword(this.email)
        .then((data) => {
          this.loading = false;
          this.sent = true;
        })
        .catch((err) => {
          Auth.forgotPassword(this.email.toLowerCase())
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
        });
    },
    setNewPassword() {
      this.loading = true;
      Auth.forgotPasswordSubmit(this.email, this.code, this.newpass)
        .then((data) => {
          this.loading = false;
          this.$notify('Password changed successfully. Please log in again');
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
