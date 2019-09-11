<template>
  <div id="wrapper">
    <main-title />
    <update-alert @hover="ccLog('update')" />
    <c-c-log ref="log" />
    <v-container style="height: 85vh; margin-top: 100px">
      <main-btn :to="'/compendium'" @hover="ccLog('compendium')">Compendium</main-btn>
      <main-btn :to="'/pilot_management'" @hover="ccLog('pilot')">Pilot Roster</main-btn>
      <main-btn :to="'/gm'" @hover="ccLog('gm')">GM Tools</main-btn>
      <main-btn :to="'/ui-test'" @hover="ccLog('campaign')">Campaign Management</main-btn>
      <main-btn :to="'/ui-test'" @hover="ccLog('homebrew')">Content Editor</main-btn>
    </v-container>

    <v-footer color="primary" fixed>
      <v-spacer />
      <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">About</v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">Help</v-btn>
      <!-- <v-divider vertical dark class="mx-1" /> -->
      <!-- <v-btn color="amber darken-3" dark small>Support This Project</v-btn> -->
    </v-footer>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About">about test</cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help">help test</cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { info } from 'lancer-data'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '../_shared/store'

import MainTitle from './_components/MainTitle.vue'
import MainBtn from './_components/MainBtn.vue'
import UpdateAlert from './_components/UpdateAlert.vue'
import CCLog from './_components/CCLog.vue'

export default Vue.extend({
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    UpdateAlert,
    CCLog,
  },
  data: () => ({
    lancerVer: info.version,
    moduleStore: {},
  }),
  created: function() {
    const moduleStore = getModule(CompendiumStore, this.$store)
    if (Vue.prototype.version) this.ver = Vue.prototype.version
    moduleStore.setDatapath(Vue.prototype.userDataPath)
    moduleStore.loadData()
    moduleStore.buildLicenses()
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
          this.$refs['log'].print('man pilot_sheet', 'Create and manage pilots and their mechs.')
          break
        case 'gm':
          this.$refs['log'].print('man gm_tools', 'Build and manage NPCs and encounters')
          break
        case 'campaign':
          this.$refs['log'].print('man campaigns', 'work in progress')
          break
        case 'homebrew':
          this.$refs['log'].print('man homebrew', 'work in progress')
          break
        case 'about':
          this.$refs['log'].print('compcon --about', 'work in progress')
          break
        case 'help':
          this.$refs['log'].print('compcon --help', 'work in progress')
          break
        case 'update':
          this.$refs['log'].print(
            'gms-upm compcon changelog -l',
            'View changelog and update COMP/CON'
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

#output-container {
  position: absolute;
  background-color: #ededed;
  width: 50vw;
  height: 200px;
  padding-top: 20px;
  top: 10px;
  z-index: 0;
}
</style>
