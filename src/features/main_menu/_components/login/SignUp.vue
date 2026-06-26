<template>
  <v-container>
    <cc-alert color="secondary"
      prominent
      icon="mdi-information-outline"
      variant="outlined"
      :title="$t('mainMenu.titles.compconCloudAccount')">
      <div class="text-text">
        <p>{{ $t('mainMenu.auth.signupEmailInfo') }}</p>
        <p class="my-1">{{ $t('mainMenu.auth.signupPrivacyInfo') }}</p>
      </div>
    </cc-alert>
    <cc-heading type="h3"
      center
      class="my-2">{{ $t('mainMenu.auth.createAccount') }}</cc-heading>

    <div class="my-4">
      <v-row justify="center"
        align="center">
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">{{ $t('mainMenu.auth.email') }}</div>
          <cc-text-field v-model="email"
            icon="mdi-email-outline"
            color="primary"
            variant="outlined" />
        </v-col>
        <v-col lg="6"
          cols="12">
          <div class="text-cc-overline pl-3">{{ $t('mainMenu.auth.password') }}</div>
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
        {{ $t('common.submit') }}
      </cc-button>
      <cc-button variant="text"
        color="error"
        @click="$emit('set-state', 'sign-in')">
        {{ $t('common.cancel') }}
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
        <div class="font-weight-bold">{{ $t('notify.common.error') }}</div>
        <div v-html-safe="error" />
      </v-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import logger from '@/user/logger';
import { signUp } from 'aws-amplify/auth';

const emit = defineEmits<{
  'success': []
}>()

const showError = ref(false)
const error = ref('')
const loading = ref(false)
const show = ref(false)
const email = ref('')
const password = ref('')

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
