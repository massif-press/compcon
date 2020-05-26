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
        <div class="d-inline heading mech mt-n5" style="font-size: 55px; letter-spacing: 8px">
          COMP/CON
        </div>
        <!-- Shout out Netlify on web for their free open source plan -->
        <a
          href="https://www.netlify.com"
          style="position: relative; top: 1px; left: 5px;"
          class="fadeSelect"
        >
          <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" />
        </a>
        <br />
        <div class="flavor-text mt-n2">
          <span>VERSION: {{ $appVersion }} // LANCER CORE {{ $lancerVersion }}</span>
        </div>
      </div>
      <v-row no-gutters class="text-center my-3 primary py-2">
        <v-col>
          <update-checker />
        </v-col>
        <v-col>
          <v-btn
            v-extlink="'https://github.com/massif-press/compcon/blob/master/CHANGELOG.md'"
            outlined
            small
            dark
          >
            <v-icon left small>
              mdi-information-outline
            </v-icon>
            View Changelog
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <v-col>
          <mobile-btn
            icon="mdi-book"
            title="Compendium"
            text="Equipment Database"
            :to="'/compendium'"
          />
        </v-col>
        <v-col>
          <mobile-btn
            icon="cci-pilot"
            title="Pilot Roster"
            text="Manage Pilots"
            :loading="pilotLoading"
            :to="'/pilot_management'"
          />
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <v-col>
          <mobile-btn disabled icon="mdi-map" title="Campaigns" text="Feature In Progress" />
        </v-col>
        <v-col>
          <mobile-btn
            icon="mdi-flask-empty-plus-outline"
            title="Content Manager"
            text="Import Content Packs"
            @clicked="$refs.contentModal.show()"
          />
        </v-col>
      </v-row>

      <v-footer color="primary" fixed>
        <v-spacer />
        <v-btn small dark text @click="$refs.optionsModal.show()">
          Options
        </v-btn>
        <v-spacer />
        <v-btn small dark text @click="$refs.aboutModal.show()">
          About
        </v-btn>
        <v-spacer />
        <v-btn small dark text @click="$refs.helpModal.show()">
          Help
        </v-btn>
        <v-spacer />
        <v-btn
          v-extlink="`https://www.patreon.com/compcon`"
          color="warning"
          small
          dark
          text
          href="https://www.patreon.com/compcon"
        >
          Support This Project
        </v-btn>
        <v-spacer />
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
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

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
  beforeMount() {
    const ns = getModule(NavStore, this.$store)
    ns.initDarkMode()
    this.$vuetify.theme.dark = ns.DarkMode
  },
})
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;
  background: url(../../assets/ui/grid.png);
  animation: 600s scroll infinite linear;
  top: 0;
  left: 0;
}

@keyframes scroll {
  100% {
    background-position: -3000px -3000px;
  }
}
</style>
