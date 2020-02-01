<template>
  <cc-major-btn
    icon="mdi-account-card-details"
    color="secondary"
    name="File Import"
    small
    @clicked="dialog = true"
  >
    <import-dialog
      v-model="dialog"
      :pilot="importPilot"
      :error="error"
      @cancel="cancelImport"
      @confirm="confirmImport"
    >
      <v-file-input
        v-model="fileValue"
        accept="text/json"
        dark
        outlined
        autofocus
        placeholder="Select Pilot Data File"
        label="UND IDENT RECORD"
        prepend-icon="mdi-paperclip"
        @change="importFile"
      />
    </import-dialog>
  </cc-major-btn>
</template>

<script lang="ts">
import Vue from 'vue'

import { Pilot } from '@/class'
import { importData } from '@/io/Data'

import ImportDialog from './ImportDialog.vue'


export default Vue.extend({
  name: 'file-import',
  components: { ImportDialog },
  data: () => ({
    dialog: false,
    // fileValue is just used to clear the file input
    fileValue: null,
    importPilot: null,
    error: null,
  }),
  watch: {
    dialog(dialogOpen) {
      if (!dialogOpen) this.reset()
    }
  },
  methods: {
    reset() {
      this.fileValue = null
      this.importPilot = null
      this.error = null
    },
    async importFile(file) {
      this.reset()
      if (!file) return
      try {
        const pilotData = await importData<IPilotData>(file)
        this.importPilot = Pilot.Deserialize(pilotData)
        this.importPilot.RenewID()
      } catch (e) {
        this.error = e.message
        return
      }
    },
    confirmImport() {
      this.importPilot.RenewID()
      this.$store.dispatch('addPilot', this.importPilot)
      this.reset()
      this.dialog = false
      this.$emit('done')
    },
    cancelImport() {
      this.reset()
      this.dialog = false
    },
  }
})
</script>

<style scoped>
#panel {
  border: 5px double var(--v-panel-border-base) !important;
  border-radius: 2px !important;
}
</style>
