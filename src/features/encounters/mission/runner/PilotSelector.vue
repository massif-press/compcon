<template>
  <v-container fluid class="px-12">
    <v-card v-for="p in pilots" :key="p.ID" cols="12" outlined class="my-1">
      <v-card-text class="pa-1">
        <v-row dense align="center">
          <v-col cols="auto" class="mr-3">
            <span class="heading h3 accent--text">{{ p.Callsign }}</span>
            <cc-slashes />
            <span class="flavor-text">{{ p.Name }} // LL {{ p.Level }}</span>
          </v-col>
          <v-divider vertical class="mx-2" />
          <v-col v-if="p.ActiveMech" cols="auto">
            <span class="heading h3 accent--text">{{ p.ActiveMech.Name }}</span>
            <cc-slashes />
            <span class="flavor-text">
              {{ p.ActiveMech.Frame.Source }} {{ p.ActiveMech.Frame.Name }}
            </span>
          </v-col>
          <v-col v-else cols="auto">
            <span class="heading h3 subtle--text">NO ACTIVE MECH</span>
          </v-col>
          <v-col cols="auto">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn outlined small class="fadeSelect" v-on="on">Change Active Mech</v-btn>
              </template>
              <v-list two-line subheader>
                <v-subheader class="heading h2 white--text primary py-0 px-2">
                  Available Mechs
                </v-subheader>
                <v-list-item
                  v-for="mech in p.Mechs"
                  :key="`mech-select-${mech.ID}`"
                  @click="p.ActiveMech = mech"
                >
                  <v-list-item-icon class="ma-0 mr-2 mt-3">
                    <cc-logo size="large" :source="mech.Frame.Manufacturer" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span
                        :class="mech.Destroyed ? 'text-decoration-line-through text--disabled' : ''"
                      >
                        {{ mech.Name }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ mech.Frame.Source }} {{ mech.Frame.Name }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <span class="flavor-text">PR//{{ p.Power }}</span>
          </v-col>
          <v-col cols="auto" class="ml-2 mr-2">
            <v-btn color="primary" :disabled="!p.ActiveMech" @click="$emit('select', p)">
              <v-icon left>mdi-plus</v-icon>
              Assign
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import { importData } from '@/io/Data'
import { PilotData } from '@/interface'

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
    selectImport() {
      this.$emit('select', this.importPilot)
      this.importPilot = null
      this.filePilot = null
      this.importID = ''
    },
    async fileImport(file) {
      try {
        const fileData = await importData<PilotData>(file)
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
