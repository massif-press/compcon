<template>
  <div id="wrapper">
    <cc-solo-dialog ref="loginModal" large no-confirm title="CLOUD ACCOUNT">
      <sign-in />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      title="Options & User Profile"
    >
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About">
      <about-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" large no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"
      ><help-page
    /></cc-solo-dialog>
    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      title="Manage Content Packs"
    >
      <content-page />
    </cc-solo-dialog>
    <v-container fluid>
      <div class="mt-n5">
        <div
          v-resize-text="{ ratio: 0.75 }"
          class="heading mech mt-n5 text-center"
          style="letter-spacing: 8px"
        >
          COMP/CON
        </div>
        <!-- Shout out Netlify on web for their free open source plan -->
        <v-btn
          target="_blank"
          href="https://www.netlify.com"
          class="fadeSelect mt-n2"
          x-small
          outlined
          block
        >
          deploys by netlify
        </v-btn>
      </div>
      <v-row dense align="center" class="my-1 px-2 primary py-2">
        <v-col cols="auto">
          <div class="flavor-text white--text">
            <span>v.{{ $appVersion }}</span>
          </div>
        </v-col>
        <v-col cols="auto ml-auto">
          <update-checker small />
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <mobile-btn
          icon="mdi-book"
          title="Compendium"
          text="Equipment Database"
          :to="'/compendium'"
        />
        <mobile-btn
          icon="cci-pilot"
          title="Roster"
          text="Manage Pilots"
          :to="'/pilot_management'"
        />
        <mobile-btn
          icon="mdi-flask-empty-plus-outline"
          title="Content"
          text="Manage LCP Data"
          @clicked="$refs.contentModal.show()"
        />
        <mobile-btn
          :icon="
            userstore.IsLoggedIn
              ? 'mdi-account-check'
              : 'mdi-account-off-outline'
          "
          :title="userstore.IsLoggedIn ? 'Connected' : 'Log In'"
          text="COMP/CON Account"
          @clicked="$refs.loginModal.show()"
        />
      </v-row>
      <div style="height: 40px" />

      <v-footer color="primary" fixed style="padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px))">
        <v-btn x-small dark outlined @click="$refs.optionsModal.show()"
          >Options</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.aboutModal.show()"
          >About</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.creditsModal.show()"
          >Credits</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.helpModal.show()"
          >Help</v-btn
        >
        <v-spacer />
        <v-btn
          target="_blank"
          href="https://www.patreon.com/compcon"
          color="warning"
          x-small
          dark
          outlined
        >
          Support
        </v-btn>
      </v-footer>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UpdateChecker from './_components/UpdateChecker.vue'
import MobileBtn from "./_components/MobileBtn.vue";
import ContentPage from "../nav/pages/ExtraContent/index.vue";
import CreditsPage from "../nav/pages/Credits.vue";
import AboutPage from "../nav/pages/About.vue";
import HelpPage from "../nav/pages/Help.vue";
import OptionsPage from "../nav/pages/Options/index.vue";
import { UserStore } from "@/store";
import { getModule } from "vuex-module-decorators";
import SignIn from "./_components/login/index.vue";

export default Vue.extend({
  name: "landing-page-mobile",
  components: {
    UpdateChecker,
    MobileBtn,
    ContentPage,
    AboutPage,
    CreditsPage,
    HelpPage,
    OptionsPage,
    SignIn,
  },
  computed: {
    userstore() {
      return getModule(UserStore, this.$store);
    },
  },
});
</script>
