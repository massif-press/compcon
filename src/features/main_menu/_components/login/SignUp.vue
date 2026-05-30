<template>
  <v-container>
    <cc-alert color="secondary"
      prominent
      icon="mdi-information-outline"
      variant="outlined"
      title="COMP/CON Cloud Account">
      <div class="text-text">
        <p>
          The e-mail address you input will be used to send you a confirmation code to finalize
          the
          creation of your account. From there, your e-mail will only be used to log in to your
          COMP/CON account.
        </p>
        <p class="my-1">
          We are committed to keeping your e-mail address confidential. We do not sell, rent, or
          lease
          contact data or lists to third parties, and we will never provide your personal
          information
          to any third party individual, government agency, or company at any time, for any reason.
        </p>
      </div>
    </cc-alert>
    <cc-heading type="h3"
      center
      class="my-2">Create Account</cc-heading>

    <div class="my-4">
      <v-row justify="center"
        align="center">
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">E-Mail</div>
          <cc-text-field v-model="email"
            icon="mdi-email-outline"
            color="primary"
            variant="outlined" />
        </v-col>
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">Password</div>
          <cc-text-field v-model="password"
            icon="mdi-lock-outline"
            color="primary"
            variant="outlined"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click-append-inner="show = !show" />
        </v-col>
      </v-row>
      <br />
      <cc-button block
        size="small"
        color="secondary"
        type="submit"
        class="my-6"
        :loading="loading"
        :disabled="!submitOk"
        @click="createAccount">
        submit
      </cc-button>
      <cc-button variant="text"
        color="error"
        @click="$emit('set-state', 'sign-in')">
        Cancel
      </cc-button>
    </div>

    <v-scroll-y-transition leave-absolute
      hide-on-leave>
      <v-alert v-if="error"
        v-model="showError"
        color="error darken-1"
        density="compact"
        class="mt-2"
        icon="mdi-alert"
        closeable
        prominent>
        <div class="font-weight-bold">ERROR</div>
        <div v-html-safe="error" />
      </v-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import logger from '@/user/logger';
import { signUp } from 'aws-amplify/auth';
import { useMobile } from '@/composables/useMobile';

defineOptions({ name: 'sign-up' })

const { mobile, portrait } = useMobile()

const emit = defineEmits<{
  'success': []
}>()

const showError = ref(false)
const error = ref('')
const loading = ref(false)
const show = ref(false)
const email = ref('')
const password = ref('')
const rules = ref({
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 6 || 'Min 6 characters',
      emailMatch: (v) =>
        !v ||
        /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) ||
        'E-mail must be valid',
    })

const submitOk = computed(() => {
      return (
        /^\w+([.-]?\w+)*(\+\w+([.-]?\w+)*)?@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(email.value) &&
        password.value.length >= 6
      );
    })

async function createAccount() {
      loading.value = true;
      try {
        const userEmail = email.value.trim().toLowerCase();
        email.value = userEmail;

        await signUp({
          username: userEmail,
          password: password.value,
          options: {
            userAttributes: {
              email: userEmail,
            },
          },
        });

        loading.value = false;
        showError.value = false;
        emit('success', userEmail);
      } catch (error: any) {
        logger.error(`Error creating account: ${error}`, this, error);
        loading.value = false;
        showError.value = true;
        error.value = error.message;
      }
    }
</script>
