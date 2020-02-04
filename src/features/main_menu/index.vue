<template>
  <div id="wrapper">
    <main-title />
    <div style="position: absolute; top: 10px; right: 5vw; z-index: 11">
      <v-btn
        v-extlink="'https://github.com/massif-press/compcon/blob/master/CHANGELOG.md'"
        color="primary"
        outlined
        small
        @mouseenter="ccLog('update')"
      >
        <v-icon left small>
          mdi-information-outline
        </v-icon>
        View Changelog
      </v-btn>
    </div>
    <web-refresh v-if="$platform === 'web'" @hover="ccLog('refresh')" />
    <c-c-log ref="log" />
    <v-container style="height: calc(100vh - 135px)">
      <v-row justify="space-between" style="height:100%">
        <main-btn :to="'/compendium'" @hover="ccLog('compendium')">Compendium</main-btn>
        <main-btn :to="'/pilot_management'" :loading="pilotLoading" @hover="ccLog('pilot')">
          Pilot Roster
        </main-btn>
        <main-btn :to="'/gm'" @hover="ccLog('gm')">Encounter Toolkit</main-btn>
        <main-btn disabled>Campaign Manager</main-btn>
        <main-btn @hover="ccLog('content')" @clicked="$refs.contentModal.show()">
          Content Manager
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" fixed>
      <v-spacer />
      <v-btn small dark text @mouseenter="ccLog('options')" @click="$refs.optionsModal.show()">
        Options
      </v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">
        About
      </v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">
        Help
      </v-btn>
      <v-divider vertical dark class="mx-1" />
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
    </v-footer>
    <cc-solo-dialog ref="optionsModal" large no-confirm title="Options & User Profile">
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"><about-page /></cc-solo-dialog>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainTitle from './_components/MainTitle.vue'
import MainBtn from './_components/MainBtn.vue'
import WebRefresh from './_components/WebRefresh.vue'
import CCLog from './_components/CCLog.vue'
import ContentPage from '../nav/pages/ExtraContent/index.vue'
import AboutPage from '../nav/pages/About.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    WebRefresh,
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
  methods: {
    ccLog(btn: string) {
      switch (btn) {
        case 'compendium':
          this.$refs['log'].print(
            'man compendium',
            'Browse the database of LANCER frames, equipment, and rules'
          )
          break
        case 'pilot':
          this.$refs['log'].print(
            'man pilot-sheet',
            'Create and manage pilots and their mechs, print character sheets, and enable active play mode'
          )
          break
        case 'gm':
          this.$refs['log'].print(
            'man gm-tools',
            'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
          )
          break
        case 'campaign':
          this.$refs['log'].print('man campaigns', 'work in progress')
          break
        case 'content':
          this.$refs['log'].print('man homebrew', 'Manage and create COMP/CON expansion data')
          break
        case 'options':
          this.$refs['log'].print('compcon -settings --verbose', 'Open the options manager')
          break
        case 'about':
          this.$refs['log'].print('compcon --v', 'About COMP/CON')
          break
        case 'help':
          this.$refs['log'].print('compcon --h', 'Open the COMP/CON help page')
          break
        case 'refresh':
          this.$refs['log'].print('sudo halt -r authrestart', 'Update and reload COMP/CON')
          break
        case 'update':
          this.$refs['log'].print(
            'gms-upm compcon changelog -l',
            'View COMP/CON changelog and latest updates'
          )
        default:
          break
      }
    },
  },
})
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;
}
</style>
