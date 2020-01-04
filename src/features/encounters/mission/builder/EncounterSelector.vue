<template>
  <cc-sidebar-view cols="3">
    <div slot="alt">
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            dense
            hide-details
            outlined
            clearable
          />
        </v-col>
      </v-row>
      <v-divider class="my-2 " />
      <v-data-table
        dense
        :items="encounters"
        :headers="headers"
        group-by="Campaign"
        :search="search"
        no-results-text="No Encounters Found"
        no-data-text="No Saved Encounters"
        hide-default-footer
        hide-default-header
        calculate-widths
        class="transparent"
        style="min-width: 100%"
      >
        <template v-slot:group.header="h" class="transparent">
          <div class="primary sliced">
            <v-icon dark left>mdi-chevron-right</v-icon>
            <span class="heading white--text">
              {{ h.group ? h.group.toUpperCase() : 'NONE' }}
            </span>
          </div>
        </template>
        <template v-slot:item.Name="{ item }">
          <span
            class="primary--text heading clickable ml-n2"
            @click="
              $vuetify.goTo(`#e_${item.ID}`, {
                duration: 150,
                easing: 'easeInOutQuad',
                offset: 25,
                container: '#bg-selector-dialog',
              })
            "
          >
            {{ item.Name }}
          </span>
        </template>
      </v-data-table>
    </div>
    <br />
    <div v-if="!encounters.length" class="grey--text heading h2 text-center">
      // NO ENCOUNTERS AVAILABLE //
    </div>
    <v-row
      v-for="(encounter, i) in encounters"
      :id="`e_${encounter.ID}`"
      :key="`${encounter.ID}_${i}`"
    >
      <v-col class="pl-0 mb-2">
        <encounter-panel :encounter="encounter" @select="select($event)" />
      </v-col>
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import EncounterPanel from './EncounterPanel.vue'
import { getModule } from 'vuex-module-decorators'
import { EncounterStore } from '@/store'
import { Encounter } from '@/class'

export default Vue.extend({
  name: 'encounter-selector',
  components: { EncounterPanel },
  data: () => ({
    encounters: [],
    side: 'Enemy',
    headers: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'PR', value: 'Power', align: 'right' },
    ],
    search: '',
  }),
  created() {
    const compendium = getModule(EncounterStore, this.$store)
    this.encounters = compendium.Encounters
  },
  methods: {
    select(enc: Encounter) {
      const newEncounter = Encounter.Deserialize(Encounter.Serialize(enc))
      newEncounter.RenewID()
      this.$emit('select', newEncounter)
    },
  },
})
</script>
