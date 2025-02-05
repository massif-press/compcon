<template>
  <v-container style="height: calc(100vh - 40px)">
    <div style="position: absolute; top: 0; left: 0; right: 0; container-type: inline-size">
      <div class="bg-primary text-center">
        <span
          class="heading text-white"
          style="letter-spacing: 3cqw; line-height: 38pt; font-size: 33pt">
          COMP/CON
        </span>
        <div class="text-cc-overline" style="position: absolute; right: 2px; opacity: 0.8">
          v.{{ appVersion }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-center align-center py-3" style="height: calc(100% - 30px)">
      <v-row dense justify="space-around" style="height: 100%">
        <mobile-btn icon="cc:compendium" title="Compendium" :to="'/compendium'" />
        <mobile-btn icon="cc:pilot" title="Roster" text="Manage Pilots" :to="'/pilot_management'" />
        <mobile-btn
          v-if="landscape"
          icon="cc:encounter"
          title="GM Toolkit"
          text="Manage Pilots"
          :to="'/gm'" />
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
          <cc-modal title="Cloud Account" icon="mdi-satellite-uplink">
            <template #activator="{ open }">
              <cc-button
                v-if="landscape"
                :loading="startingUp"
                size="small"
                class="mx-2"
                :variant="isLoggedIn ? '' : 'outlined'"
                :color="isLoggedIn && 'success'"
                @click="open">
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
                @click="open" />
            </template>
            <sign-in />
          </cc-modal>
        </v-col>

        <v-divider vertical class="mr-2" />

        <v-col cols="auto">
          <cc-modal title="Options" icon="mdi-cog">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0" size="small" variant="text" @click="open">
                Options
              </cc-button>
            </template>
            <options-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="About" icon="mdi-information">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0" size="small" variant="text" @click="open">
                About
              </cc-button>
            </template>
            <about-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="Credits" icon="cc:gms">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0" size="small" variant="text" @click="open">
                Credits
              </cc-button>
            </template>
            <credits-page />
          </cc-modal>
        </v-col>

        <v-col cols="auto">
          <cc-modal title="Help" icon="mdi-help-circle">
            <template #activator="{ open }">
              <cc-button class="text-uppercase pa-0" size="small" variant="text" @click="open">
                Help
              </cc-button>
            </template>
            <help-page />
          </cc-modal>
        </v-col>
      </v-row>
    </v-bottom-navigation>
  </v-container>
  <cc-solo-dialog ref="loginModal" no-confirm title="CLOUD ACCOUNT">
    <sign-in />
  </cc-solo-dialog>
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
    landscape() {
      return this.$vuetify.display.smAndUp;
    },
  },
};
</script>
