<template>
  <div>
    <v-slide-x-transition group leave-absolute>
      <div v-if="state === 'sign-in'" key="sign-in">
        <sign-in
          @set-state="state = $event"
          @close="$emit('close')"
          @reverify="verifyFlow($event)" />
      </div>
      <div v-else-if="state === 'reset'" key="password-reset">
        <password-reset @set-state="state = $event" />
      </div>
      <div v-else-if="state === 'sign-up'" key="sign-up">
        <sign-up
          :oauth-code="oauthCode"
          @set-state="state = $event"
          @success="verifyFlow($event)" />
      </div>
      <div v-else-if="state === 'verify'" key="verify">
        <verify :email="email" @set-state="state = $event" />
      </div>
      <div v-else-if="state === 'signed-in'" key="signed-in">
        <signed-in @set-state="state = $event" />
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SignIn from './SignIn.vue';
import PasswordReset from './PasswordReset.vue';
import SignUp from './SignUp.vue';
import Verify from './Verify.vue';
import SignedIn from './SignedIn.vue';
import { UserStore } from '@/stores';

defineOptions({ name: 'login-auth' })

const state = ref('sign-in')
const email = ref('')
const currentAuthedUser = ref(null)
const oauthCode = ref(null)

function verifyFlow(email) {
      email.value = email;
      state.value = 'verify';
    }

onMounted(() => {
if (UserStore().IsLoggedIn) {
      state.value = 'signed-in';
    }
})
</script>
