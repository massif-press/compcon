<template>
  <div id="wrapper">
    <main-title />
    <update-alert @hover="ccLog('update')" />
    <c-c-log ref="log" />
    <v-container style="height: calc(100vh - 135px)">
      <v-row justify="space-between" style="height:100%">
        <main-btn :to="'/compendium'" @hover="ccLog('compendium')">Compendium</main-btn>
        <main-btn :to="'/pilot_management'" :loading="pilotLoading" @hover="ccLog('pilot')">
          Pilot Roster
        </main-btn>
        <main-btn :to="'/gm'" @hover="ccLog('gm')">Encounter Toolkit</main-btn>
        <main-btn disabled>Campaign Manager</main-btn>
        <main-btn disabled>Content Editor</main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" fixed>
      <v-spacer />
      <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">
        About
      </v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">
        Help
      </v-btn>
      <v-divider vertical dark class="mx-1" />
      <v-btn color="warning" small dark text>Support This Project</v-btn>
    </v-footer>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About">about test</cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help">help test</cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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
            'man pilot_sheet',
            'Create and manage pilots and their mechs, print character sheets, and enable active play mode.'
          )
          break
        case 'gm':
          this.$refs['log'].print(
            'man gm_tools',
            'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
          )
          break
        case 'campaign':
          this.$refs['log'].print('man campaigns', 'work in progress')
          break
        case 'homebrew':
          this.$refs['log'].print('man homebrew', 'work in progress')
          break
        case 'about':
          this.$refs['log'].print('compcon --v', 'work in progress')
          break
        case 'help':
          this.$refs['log'].print('compcon --h', 'work in progress')
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
