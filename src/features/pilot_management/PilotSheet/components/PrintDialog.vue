<template>
  <cc-solo-dialog ref="dialog" icon="mdi-printer" large no-confirm title="Print Character Sheets">
    <v-card-text>
      <v-select
        v-model="selectedMechID"
        :items="pilot.Mechs"
        item-text="Name"
        item-value="ID"
        label="Include Mech (optional)"
        outlined
        clearable
      />

      <v-btn class="my-2" color="primary" large block tile @click="print()">Print</v-btn>
      <v-btn class="my-2" small color="accent" outlined block tile @click="printBlank()">
        Print Blank Character Sheets
      </v-btn>
      <cc-tooltip simple content="Feature In Development">
        <v-btn class="my-2" small text block tile disabled>
          Print Character Campaign Portfolio
          <v-icon right small>mdi-information-outline</v-icon>
        </v-btn>
      </cc-tooltip>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'print-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedMechID: null,
  }),
  created() {
    if (this.pilot.ActiveMech) this.selectedMechID = this.pilot.ActiveMech.ID
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    print() {
      this.$router.push(`/print/${this.pilot.ID}/${this.selectedMechID}`)
    },
    printBlank() {
      this.$router.push(`/print/blank/blank`)
    },
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-primary-base);
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: var(--v-primary-base);
  color: #fff;
  padding: 3px 6px;
}
</style>
