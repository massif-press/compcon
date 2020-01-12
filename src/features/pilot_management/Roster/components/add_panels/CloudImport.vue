<template>
  <cc-major-btn
    icon="mdi-cloud-download"
    color="success"
    name="Cloud Import"
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
      <v-text-field
        v-model="importID"
        dark
        autofocus
        label="UND IDENT ID"
        placeholder="Input Pilot Share ID"
        outlined
        color="primary"
        append-outer-icon="mdi-cloud-search"
        :loading="cloudLoading"
        @click:append-outer="cloudImport"
        @keypress.enter="cloudImport"
      />
    </import-dialog>
    <!-- <v-dialog v-model="dialog" width="50vw">
      <v-card
        id="panel"
        tile
        color="black"
        style="border: 6px double var(--v-panel-border-base) !important; border-radius: 2px !important;"
      >
        <v-row>
          <v-col cols="7" class="ml-auto mr-auto">
            
          </v-col>
        </v-row>
        <load-log ref="log" />
        \
        <v-divider dark />
        <v-card-actions v-if="cloudLoading">
          <v-progress-circular color="white" indeterminate size="22"></v-progress-circular>
          <span class="white--text flavor-text ml-2">Connecting...</span>
          <v-spacer />
          <v-btn small color="grey" text @click="dialog = false">Dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else-if="importPilot">
          <span class="white--text flavor-text">
            Import
            <b>{{ importPilot.Name }}</b>
            ?
          </span>
          <v-spacer />
          <cc-btn class="mx-2" small color="error" @click="dialog = false">Cancel</cc-btn>
          <cc-btn class="mx-2" small color="success">Confirm</cc-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer />
          <v-btn small color="grey" text @click="dialog = false">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->
  </cc-major-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import gistApi from '@/io/apis/gist'
import { Pilot } from '@/class'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '../../../store'

import ImportDialog from './ImportDialog.vue'

export default Vue.extend({
  name: 'cloud-import',
  components: { ImportDialog },
  data: () => ({
    dialog: false,
    importID: '',
    importPilot: null,
    cloudLoading: false,
    error: null,
  }),
  watch: {
    dialog(open) {
      if (!open) this.reset()
    }
  },
  methods: {
    reset() {
      this.importPilot = null
      this.error = null
      this.cloudLoading = false
    },
    async cloudImport() {
      this.reset()
      this.cloudLoading = true
      try {
        const pilotData = await gistApi.loadPilot(this.importID)
        this.importPilot = Pilot.Deserialize(pilotData)
      } catch (e) {
        this.error = e.message
      }
      this.cloudLoading = false
    },
    confirmImport() {
      this.importPilot.RenewID()
      getModule(PilotManagementStore, this.$store).addPilot(this.importPilot)
      this.reset()
      this.dialog = false
      this.importID = ''
      this.$emit('done')
    },
    cancelImport() {
      this.reset()
      this.importID = ''
      this.dialog = false
    },
  },
})
</script>

<style scoped>
#panel {
  border: 5px double var(--v-panel-border-base) !important;
  border-radius: 2px !important;
}
</style>
