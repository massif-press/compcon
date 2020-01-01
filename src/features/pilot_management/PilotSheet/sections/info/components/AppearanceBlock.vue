<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-icon label="Edit Pilot Appearance" @open-selector="show()" />
      Pilot Appearance
    </cc-title>
    <div class="my-2">
      <p
        v-if="pilot.TextAppearance"
        class="flavor-text text--text mx-2"
        v-html="pilot.TextAppearance"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Appearance"
      @confirm="pilot.TextAppearance = appearance"
    >
      <v-textarea v-model="appearance" rows="15" outlined class="mt-6" />
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
  name: 'appearance-block',
  components: { SectionEditIcon, NoDataBlock },
  data: () => ({
    appearance: '',
  }),
  mixins: [activePilot],
  created() {
    this.appearance = this.pilot.TextAppearance || ''
  },
  methods: {
    show() {
      this.appearance = this.pilot.TextAppearance || ''
      this.$refs.dialog.show()
    },
  },
})
</script>
