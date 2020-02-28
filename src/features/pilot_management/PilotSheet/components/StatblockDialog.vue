<template>
  <cc-solo-dialog ref="dialog" icon="mdi-text-subject" large no-confirm title="Pilot Statblock">
    <v-card-text>
      <v-select
        v-model="mechSelect"
        :items="pilot.Mechs"
        placeholder="N/A"
        item-text="Name"
        item-value="ID"
        label="Include Mech (optional)"
        outlined
        clearable
        hide-details
      />
      <div :style="{ opacity: !!mechSelect ? 1 : 0 }">
        <v-checkbox v-model="buildSummary" label="Compact / Build Summary" />
      </div>
      <v-textarea :value="statblock" auto-grow readonly outlined filled class="flavor-text" />
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Statblock } from '@/class'

export default Vue.extend({
  name: 'statblock-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    mechSelect: undefined,
    buildSummary: false
  }),
  computed: {
    statblock(): string {
      const mech = this.mechSelect ? this.pilot.Mechs.find(x => x.ID === this.mechSelect) : null
      if (this.buildSummary) {
        return Statblock.GenerateBuildSummary(this.pilot, mech)
      }
      else return Statblock.Generate(this.pilot, mech)
    },
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
  },
})
</script>
