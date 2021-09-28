<template>
  <v-col cols="6">
    <v-btn large block tile color="success darken-1" class="white--text" @click="dialog = true">
      <v-icon left class="pr-2">mdi-cloud-download</v-icon>
      <b>Cloud Download (deprecated)</b>
    </v-btn>
    <import-dialog
      v-model="dialog"
      :pilot="importPilot"
      :error="error"
      :loading="cloudLoading"
      @cancel="cancelImport"
      @confirm="confirmImport"
    >
      <v-row dense align="center">
        <v-col>
          <v-text-field
            v-model="importID"
            dark
            autofocus
            dense
            hide-details
            label="Pilot Share ID"
            placeholder="Input Pilot Share ID"
            outlined
            :loading="cloudLoading"
            @keypress.enter="cloudImport"
          />
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn large color="primary" @click="cloudImport">
            <v-icon left>mdi-cloud-search</v-icon>
            Link Pilot
          </v-btn>
        </v-col>
      </v-row>
    </import-dialog>
    <v-dialog v-model="missingContentWarning">
      <v-card>
        <v-card-text class="text-center">
          <br />
          <p class="heading h3 accent--text">
            WARNING: The imported Pilot requires the following content packs that are not currently
            installed:
          </p>
          <p class="effect-text text-center" v-html="missingContent" />
          <p class="text--text">
            This Pilot cannot be imported until the missing content packs are installed and
            activated.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="cancelImport">Abort Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import gistApi from '@/io/apis/gist'
import { Pilot } from '@/class'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore, CompendiumStore } from '@/store'

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
    missingContentWarning: false,
    missingContent: '',
  }),
  watch: {
    dialog(open) {
      if (!open) this.reset()
    },
  },
  methods: {
    reset() {
      this.importPilot = null
      this.error = null
      this.cloudLoading = false
      this.missingContentWarning = false
    },
    async cloudImport() {
      this.reset()
      this.cloudLoading = true
      try {
        const pilotData = await gistApi.loadPilot(this.importID)
        if (!pilotData.brews) pilotData.brews = []
        const installedPacks = getModule(CompendiumStore, this.$store).ContentPacks.map(
          x => `${x.Name} @ ${x.Version}`
        )
        const missingPacks = this.$_.pullAll(pilotData.brews, installedPacks)
        if (missingPacks.length) {
          this.missingContent = missingPacks.join('<br />')
          this.missingContentWarning = true
        }
        this.importPilot = Pilot.Deserialize(pilotData)
        this.importPilot.brews = pilotData.brews
        this.importPilot.RenewID()
      } catch (e) {
        this.error = e.message
      }
      this.cloudLoading = false
    },
    confirmImport() {
      const importPilot = this.importPilot as Pilot
      if (!importPilot.GistCode) {
        importPilot.GistCode = this.importID
      }
      importPilot.Group = ''
      getModule(PilotManagementStore, this.$store).addPilot({ pilot: importPilot, update: true })
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
