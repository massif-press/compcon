<template>
  <div id="wrapper">
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
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"><help-page /></cc-solo-dialog>
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
          v-extlink="`https://www.netlify.com`"
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
      <v-row dense justify="space-between">
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
          :loading="pilotLoading"
          :to="'/pilot_management'"
        />
        <mobile-btn disabled icon="mdi-map" title="Campaigns" text="WIP" />
        <mobile-btn
          icon="mdi-flask-empty-plus-outline"
          title="Content Packs"
          text="Manage LCPs"
          disabled
        />
        <!-- @clicked="$refs.contentModal.show()" -->
      </v-row>

      <v-footer color="primary" fixed>
        <v-btn x-small dark outlined @click="$refs.optionsModal.show()">
          Options
        </v-btn>
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.aboutModal.show()">
          About
        </v-btn>
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.helpModal.show()">
          Help
        </v-btn>
        <v-spacer />
        <v-btn
          v-extlink="`https://www.patreon.com/compcon`"
          color="warning"
          x-small
          dark
          outlined
          href="https://www.patreon.com/compcon"
        >
          Support
        </v-btn>
      </v-footer>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UpdateChecker from './_components/UpdateChecker.vue'
import MobileBtn from './_components/MobileBtn.vue'
import ContentPage from '../nav/pages/ExtraContent/index.vue'
import AboutPage from '../nav/pages/About.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options/index.vue'

export default Vue.extend({
  name: 'landing-page-mobile',
  components: {
    UpdateChecker,
    MobileBtn,
    ContentPage,
    AboutPage,
    HelpPage,
    OptionsPage,
  },
  data: () => ({
    pilotLoading: false,
  }),
  beforeRouteLeave(to, from, next) {
    if (to.path === '/pilot_management') this.pilotLoading = true
    next()
  },
})
</script>
