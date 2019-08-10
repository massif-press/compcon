<template>
  <div id="wrapper">
    <main-title />
    <update-alert @hover="ccLog('update')" />
    <v-container fluid style="height: 85vh">
      <v-layout row fill-height>
        <v-flex fill-height>
          <v-layout column fill-height justfiy-space-around class="mb-4 ml-4 pb-4">
            <c-c-log ref="log" />
            <v-spacer />
            <main-btn :to="'/compendium'" @hover="ccLog('compendium')">Compendium</main-btn>
            <main-btn :to="'/pilot_management'" @hover="ccLog('pilot')">Pilot Roster</main-btn>
            <main-btn :to="'/gm'" @hover="ccLog('gm')">GM Tools</main-btn>
            <main-btn :to="'/ui-test'" @hover="ccLog('campaign')">Campaign Management</main-btn>
            <main-btn :to="'/ui-test'" @hover="ccLog('homebrew')">Content Editor</main-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>

    <v-footer color="primary" fixed>
      <v-spacer />
      <v-btn text small dark>About</v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn text small dark>Help</v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn color="amber darken-3" dark small>Support This Project</v-btn>
    </v-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { info } from 'lancer-data'

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
  }),
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
  created() {
    if (Vue.prototype.version) this.ver = Vue.prototype.version
    this.$store.dispatch('setDatapath', Vue.prototype.userDataPath)
    this.$store.dispatch('loadData')
    this.$store.dispatch('buildLicenses')
  },
})
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;
}
</style>

<style>
#output-container {
  position: absolute;
  background-color: #ededed;
  width: 50vw;
  height: 200px;
  padding-top: 20px;
  top: 10px;
  z-index: 0;
}

body {
  overflow: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
</style>
``