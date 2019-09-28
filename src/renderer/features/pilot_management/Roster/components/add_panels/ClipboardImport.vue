<template>
  <cc-major-btn
    icon="mdi-clipboard-account"
    color="secondary"
    name="Clipboard Import"
    small
    @clicked="cbImport"
  >
    <v-dialog v-model="dialog" width="50vw">
      <v-card
        id="panel"
        tile
        color="black"
        style="border: 6px double var(--v-panel-border-base) !important; border-radius: 2px !important;"
      >
        <load-log ref="log" />\
        <v-divider dark />
        <v-card-actions v-if="importPilot">
          <span class="white--text flavor-text">
            Import
            <b>{{ importPilot.Name }}</b>
            ?
          </span>
          <v-spacer />
          <cc-btn class="mx-2" small color="error">Cancel</cc-btn>
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
import LoadLog from './loaders/LoadLog.vue'
import { clipboard } from 'electron'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'clipboard-import',
  components: { LoadLog },
  data: () => ({
    dialog: false,
    importPilot: null,
  }),
  methods: {
    cbImport() {
      var vm = this as any
      vm.dialog = true
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