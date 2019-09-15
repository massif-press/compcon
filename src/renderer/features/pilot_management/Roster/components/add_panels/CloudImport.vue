<template>
  <cc-major-btn
    icon="mdi-cloud-download"
    color="success"
    name="Cloud Import"
    @clicked="dialog = true"
    small
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
import apis from '@/features/_shared/apis'
import LoadLog from './loaders/LoadLog.vue'
import { clipboard } from 'electron'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'cloud-import',
  components: { LoadLog },
  data: () => ({
    dialog: false,
    importPilot: null,
    cloudLoading: false,
  }),
  methods: {
    cloudImport() {
      var vm = this as any
      vm.dialog = true

      vm.cloudLoading = true
      apis
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

      validator.clipboardPilot(clipboard.readText(), function(err, result) {
        if (err) {
          //TODO: log this
          //TODO: notification
          Vue.nextTick().then(function() {
            vm.$refs['log'].type(true)
          })
        } else {
          vm.importPilot = Pilot.Deserialize(result)
          Vue.nextTick().then(function() {
            vm.$refs['log'].type(false)
          })
        }
      })
    },
    confirmImport() {
      this.importPilot.RenewID()
      this.$store.dispatch('addPilot', this.importPilot)
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