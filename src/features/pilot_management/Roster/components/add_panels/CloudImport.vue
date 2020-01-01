<template>
  <cc-major-btn
    icon="mdi-cloud-download"
    color="success"
    name="Cloud Import"
    small
    @clicked="dialog = true"
  >
    <v-dialog v-model="dialog" width="50vw">
      <v-card
        id="panel"
        tile
        color="black"
        style="border: 6px double var(--v-panel-border-base) !important; border-radius: 2px !important;"
      >
        <v-row>
          <v-col cols="7" class="ml-auto mr-auto">
            <v-text-field
              v-model="importID"
              dark
              autofocus
              label="UND IDENT ID"
              placeholder="Input Pilot Share ID"
              outlined
              color="primary"
              append-outer-icon="mdi-cloud-search"
              @click:append-outer="cloudImport"
            ></v-text-field>
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
    </v-dialog>
  </cc-major-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import gistApi from '@/io/apis/gist'
import LoadLog from './loaders/LoadLog.vue'
import { Pilot } from '@/class'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '../../../store'

export default Vue.extend({
  name: 'cloud-import',
  components: { LoadLog },
  data: () => ({
    dialog: false,
    importID: '',
    importPilot: null,
    cloudLoading: false,
  }),
  methods: {
    async cloudImport() {
      this.dialog = true
      this.cloudLoading = true
      const pilotData = await gistApi.loadPilot(this.importID)
      const newPilot = Pilot.Deserialize(pilotData)
      newPilot.RenewID()
      getModule(PilotManagementStore, this.$store).addPilot(newPilot)
      this.cloudDialog = false
      this.cloudLoading = false
      this.dialog = false
      this.$emit('done')
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
