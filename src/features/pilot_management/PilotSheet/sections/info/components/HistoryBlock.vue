<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-icon label="Edit Pilot Biography" @open-selector="show()" />
      Pilot Biography
    </cc-title>
    <div class="my-2">
      <p v-if="pilot.History" class="flavor-text text--text mx-2" v-html="pilot.History" />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Appearance"
      @confirm="pilot.History = history"
    >
      <v-textarea v-model="history" rows="15" outlined class="mt-6" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditIcon from '../../components/SectionEditIcon.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'history-block',
  components: { SectionEditIcon, NoDataBlock },
  data: () => ({
    history: '',
  }),
  mixins: [activePilot],
  created() {
    this.history = this.pilot.History || ''
  },
  methods: {
    show() {
      this.history = this.pilot.History || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
