<template>
  <v-container style="height: calc(100vh - 60px)">
    <div style="position: absolute; top: 0; left: 0; right: 0; container-type: inline-size">
      <div class="bg-primary text-center">
        <span
          class="heading text-white"
          style="letter-spacing: 3cqw; line-height: 38pt; font-size: 33pt">
          COMP/CON
        </span>
      </div>
      <div class="text-cc-overline px-1 pt-1 text-right" style="opacity: 0.8">
        v.{{ appVersion }}
      </div>
    </div>

    <div class="d-flex justify-center align-center py-3" style="height: 100%">
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

    <v-bottom-navigation density="compact" class="bg-primary">
      <v-row no-gutters align="center" justify="space-around">
        <v-col cols="auto">
          <cc-button
            v-if="$vuetify.display.smAndUp"
            :loading="startingUp"
            size="small"
            class="mx-2"
            :variant="isLoggedIn ? '' : 'outlined'"
            :color="isLoggedIn ? 'success' : 'panel'"
            @click="($refs.loginModal as any).show()">
            {{ isLoggedIn ? 'Connected' : 'Sign In' }}
          </cc-button>

          <cc-button
            v-else
            :loading="startingUp"
            size="small"
            class="mx-2"
            :variant="isLoggedIn ? '' : 'outlined'"
            :color="isLoggedIn ? 'success' : ''"
            :icon="isLoggedIn ? 'mdi-satellite-uplink' : 'mdi-account-off-outline'"
            @click="($refs.loginModal as any).show()" />
        </v-col>

        <v-divider vertical class="mr-2" />

        <v-col cols="auto">
          <cc-button
            class="text-uppercase pa-0"
            size="small"
            variant="text"
            @click="($refs as any).optionsModal.show()">
            Options
          </cc-button>
        </v-col>

        <v-col cols="auto">
          <cc-button
            class="text-uppercase pa-0"
            size="small"
            variant="text"
            @click="($refs as any).aboutModal.show()">
            About
          </cc-button>
        </v-col>

        <v-col cols="auto">
          <cc-button
            class="text-uppercase pa-0"
            size="small"
            variant="text"
            @click="($refs as any).creditsModal.show()">
            Credits
          </cc-button>
        </v-col>

        <v-col cols="auto">
          <cc-button
            class="text-uppercase pa-0"
            size="small"
            variant="text"
            @click="($refs as any).helpModal.show()">
            Help
          </cc-button>
        </v-col>
      </v-row>
    </v-bottom-navigation>
  </v-container>
  <cc-solo-dialog ref="loginModal" no-confirm title="CLOUD ACCOUNT">
    <sign-in />
  </cc-solo-dialog>
  <cc-solo-dialog ref="optionsModal" no-confirm no-title-clip title="Options">
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
