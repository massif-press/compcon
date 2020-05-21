<template>
  <v-container fluid class="px-12">
    <v-card v-for="p in pilots" :key="p.ID" cols="12" outlined class="my-1">
      <v-card-text class="pa-1">
        <v-row v-if="p.ActiveMech" dense align="center">
          <v-col cols="auto" class="mr-3">
            <span class="heading h3 accent--text">{{ p.Callsign }}</span>
            <cc-slashes />
            <span class="flavor-text">{{ p.Name }} // LL {{ p.Level }}</span>
          </v-col>
          <v-divider vertical class="mx-2" />
          <v-col>
            <span class="heading h3 accent--text">{{ p.ActiveMech.Name }}</span>
            <cc-slashes />
            <span class="flavor-text">
              {{ p.ActiveMech.Frame.Source }} {{ p.ActiveMech.Frame.Name }}
            </span>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <span class="flavor-text">PR//{{ p.Power }}</span>
          </v-col>
          <v-col cols="auto" class="ml-2 mr-2">
            <v-btn color="primary" @click="$emit('select', p)">
              <v-icon left>mdi-plus</v-icon>
              Assign
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else dense align="center" class="panel">
          <v-col cols="auto" class="mr-3">
            <span class="heading h3 subtle--text">{{ p.Callsign }}</span>
            <cc-slashes />
            <span class="flavor-text subtle--text">{{ p.Name }} // LL {{ p.Level }}</span>
          </v-col>
          <v-divider vertical class="mx-2" />
          <v-col>
            <span class="heading h3 subtle--text">NO ACTIVE MECH</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider class="my-3" />
    <v-progress-linear v-if="cloudLoading" indeterminate size="22" />
    <v-alert v-model="error" text prominent dismissible type="error" icon="mdi-cloud-alert">
      {{ errorText }}
    </v-alert>
    <v-row dense>
      <v-col class="mx-2">
        <v-text-field
          v-model="importID"
          label="Pilot Cloud Share ID"
          outlined
          hide-details
          color="primary"
          append-outer-icon="mdi-cloud-search"
          @click:append-outer="cloudImport()"
          @keyup.enter="cloudImport()"
        />
        <v-btn
          x-large
          block
          tile
          color="primary"
          class="my-1"
          :disabled="!importPilot || !importPilot.ActiveMech"
          @click="selectImport()"
        >
          <span v-if="importPilot">
            Import
            <b>{{ importPilot.Name }}</b>
          </span>
          <span v-else>No Cloud Save Loaded</span>
        </v-btn>
        <span v-if="importPilot && !importPilot.ActiveMech">
          Imported Pilot has no active mech selected. Unable to assign to mission.
        </span>
      </v-col>
      <v-col class="mx-2">
        <v-file-input counter label="Pilot Save File" outlined hide-details @change="fileImport" />
        <v-btn
          x-large
          block
          tile
          color="primary"
          class="my-1"
          :disabled="!filePilot || !filePilot.ActiveMech"
          @click="selectImport()"
        >
          <span v-if="filePilot">
            Import
            <b>{{ filePilot.Name }}</b>
          </span>
          <span v-else>No File Save Loaded</span>
        </v-btn>
        <span v-if="filePilot && !filePilot.ActiveMech">
          Imported Pilot has no active mech selected. Unable to assign to mission.
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import gistApi from '@/io/apis/gist'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { importData } from '@/io/Data'

export default Vue.extend({
  name: 'pilot-selector',
  props: {
    selectedPilots: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    importID: '',
    importPilot: null,
    filePilot: null,
    cloudLoading: false,
    error: false,
    errorText: '',
  }),
  computed: {
    pilots() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.Pilots.filter(x => !this.selectedPilots.some(y => y.ID === x.ID))
    },
  },
  methods: {
    async cloudImport() {
      this.dialog = true
      this.cloudLoading = true
      try {
        const pilotData = await gistApi.loadPilot(this.importID)
        this.importPilot = Pilot.Deserialize(pilotData)
        this.importPilot.RenewID()
        this.cloudLoading = false
      } catch (error) {
        this.error = true
        this.errorText = error
        this.cloudLoading = false
      }
    },
    selectImport() {
      this.$emit('select', this.importPilot)
      this.importPilot = null
      this.filePilot = null
      this.importID = ''
    },
    async fileImport(file) {
      try {
        const fileData = await importData<IPilotData>(file)
        this.filePilot = Pilot.Deserialize(fileData)
        this.filePilot.RenewID()
      } catch (error) {
        this.error = true
        this.errorText = error
      }
    },
    selectFile() {
      this.$emit('select', this.importPilot)
      this.filePilot = null
      this.importPilot = null
      this.importID = ''
    },
  },
})
</script>
