<template>
  <v-container style="margin-top: -40px">
    <div class="heading mech text-center" style="letter-spacing: 3vw; line-height: 10vw">
      COMP/CON
    </div>
    <div class="flavor-text text-right">v.{{ appVersion }}</div>

    <div class="d-flex justify-center align-center" style="height: calc(100vh - 10vw - 140px)">
      <v-row dense justify="space-around" style="height: 100%">
        <mobile-btn icon="cc:compendium" title="Compendium" :to="'/compendium'" />
        <mobile-btn icon="cc:pilot" title="Roster" text="Manage Pilots" :to="'/pilot_management'" />
        <mobile-btn
          icon="cc:content_manager"
          title="Content"
          @clicked="($refs as any).contentModal.show()" />
        <mobile-btn icon="cc:campaign" title="Active Mode" :to="'/active-mode'" />
      </v-row>
    </div>

    <v-footer app density="compact" fixed>
      <v-spacer />
      <v-btn
        size="small"
        flat
        :loading="startingUp"
        :prepend-icon="isLoggedIn ? 'mdi-satellite-uplink' : 'mdi-account-off-outline'"
        @click="($refs.loginModal as any).show()">
        <span>{{ isLoggedIn ? 'Connected' : 'Log In' }}</span>
      </v-btn>
      <cloud-notifications />
      <v-spacer />
    </v-footer>

    <v-bottom-navigation app density="compact">
      <v-btn @click="($refs as any).optionsModal.show()">Options</v-btn>
      <v-btn @click="($refs as any).aboutModal.show()">About</v-btn>
      <v-btn @click="($refs as any).creditsModal.show()">Credits</v-btn>
      <v-btn @click="($refs as any).helpModal.show()">Help</v-btn>
    </v-bottom-navigation>
  </v-container>
  <cc-solo-dialog ref="loginModal" no-confirm title="CLOUD ACCOUNT">
    <sign-in />
  </cc-solo-dialog>
  <cc-solo-dialog ref="optionsModal" no-confirm no-title-clip title="Options & User Profile">
    <options-page />
  </cc-solo-dialog>
  <cc-solo-dialog ref="aboutModal" no-confirm title="About">
    <about-page />
  </cc-solo-dialog>
  <cc-solo-dialog ref="creditsModal" no-confirm title="Credits">
    <credits-page />
  </cc-solo-dialog>
  <cc-solo-dialog ref="helpModal" no-confirm title="Help"><help-page /></cc-solo-dialog>
  <cc-solo-dialog
    ref="contentModal"
    no-title-clip
    no-pad
    large
    no-confirm
    title="Manage Content Packs">
    <content-page />
  </cc-solo-dialog>
</template>

<script lang="ts">
import MobileBtn from './_components/MobileBtn.vue';
import ContentPage from '../nav/pages/ExtraContent/index.vue';
import CreditsPage from '../nav/pages/Credits.vue';
import AboutPage from '../nav/pages/About.vue';
import HelpPage from '../nav/pages/Help.vue';
import OptionsPage from '../nav/pages/Options/index.vue';
import { UserStore } from '@/stores';
import SignIn from './_components/login/index.vue';
import CloudNotifications from '../nav/CloudNotifications.vue';

export default {
  name: 'landing-page-mobile',
  components: {
    MobileBtn,
    ContentPage,
    AboutPage,
    CreditsPage,
    HelpPage,
    OptionsPage,
    SignIn,
    CloudNotifications,
  },
  computed: {
    userstore() {
      return UserStore();
    },
    isLoggedIn() {
      return UserStore().IsLoggedIn;
    },
    startingUp() {
      return UserStore().IsLoading;
    },
    appVersion(): string {
      return import.meta.env.VITE_APP_VERSION;
    },
  },
};
</script>
