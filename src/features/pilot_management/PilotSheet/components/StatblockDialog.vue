<template>
  <cc-solo-dialog ref="dialog" icon="mdi-text-subject" large no-confirm title="Pilot Statblock">
    <v-card-text>
      <span>A flavorful description...</span>
      <v-select
        v-model="mechSelect"
        :items="pilot.Mechs"
        item-text="Name"
        item-value="ID"
        label="Include Mech (optional)"
        outlined
        clearable
      />
      <v-textarea :value="statblock" auto-grow readonly outlined filled class="flavor-text" />
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Statblock } from '@/class'

export default Vue.extend({
  name: 'cloud-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    mechSelect: '',
  }),
  computed: {
    statblock(): string {
      const m = this.mechSelect ? this.pilot.Mechs.find(x => x.ID === this.mechSelect) : null
      return Statblock.Generate(this.pilot, m)
    },
  },
  created() {
    if (this.pilot.ActiveMech) this.mechSelect = this.pilot.ActiveMech
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
