<template>
  <cc-major-btn
    icon="mdi-account-card-details"
    color="secondary"
    name="File Import"
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
            <v-file-input
              ref=""
              accept="text/json"
              dark
              outlined
              autofocus
              placeholder="Select Pilot Data File"
              label="UND IDENT RECORD"
              prepend-icon="mdi-paperclip"
              @change="fileImport"
            ></v-file-input>
          </v-col>
        </v-row>
        <load-log ref="log" />
        \
        <v-divider dark />
        <v-card-actions v-if="importPilot">
          <span class="white--text flavor-text">
            Import
            <b>{{ importPilot.Name }}</b>
            ?
          </span>
          <v-spacer />
          <cc-btn class="mx-2" small color="error" @click="cancelImport">Cancel</cc-btn>
          <cc-btn class="mx-2" small color="success" @click="confirmImport">Confirm</cc-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer />
          <v-btn small color="grey" text @click="cancelImport">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </cc-major-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import LoadLog from './loaders/LoadLog.vue'
import { Pilot } from '@/class'
import { importData } from '@/io/Data'

export default Vue.extend({
  name: 'file-import',
  components: { LoadLog },
  data: () => ({
    dialog: false,
    importPilot: null,
  }),
  methods: {
    async fileImport(file) {
      const pilotData = await importData<IPilotData>(file)
      this.importPilot = Pilot.Deserialize(pilotData)
      this.importPilot.RenewID()
    },
    confirmImport() {
      this.importPilot.RenewID()
      this.$store.dispatch('addPilot', this.importPilot)
      this.dialog = false
      this.$emit('done')
    },
    cancelImport() {
      this.importPilot = null
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
