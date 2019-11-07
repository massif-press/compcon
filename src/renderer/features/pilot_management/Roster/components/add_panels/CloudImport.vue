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
        <load-log ref="log" />\
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
import validator from '@/features/pilot_management/logic/validator'
import apis from '@/io/apis'
import LoadLog from './loaders/LoadLog.vue'
import { clipboard } from 'electron'
import { Pilot } from '@/class'

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
    cloudImport() {
      const vm = this
      vm.dialog = true
      vm.cloudLoading = true
      apis
        .loadPilot(vm.importID)
        .importPilotGist(vm.shareIDText)
        .then((gist: any) => {
          let newPilotData = JSON.parse(gist.files['pilot.txt'].content)
          let newPilot = Pilot.Deserialize(newPilotData)
          newPilot.RenewID()
          vm.$store.dispatch('addPilot', newPilot)
          vm.cloudDialog = false
          vm.cloudLoading = false
          vm.close()
        })
        .catch(function(err: any) {
          vm.errorText = 'Pilot Import Failed! Cannot resolve this Share ID'
          vm.cloudLoading = false
        })
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