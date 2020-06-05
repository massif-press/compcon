<template>
  <cc-sidebar-view cols="3">
    <div slot="sidebar">
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
        disable-pagination
        hide-default-footer
        hide-default-header
        calculate-widths
        class="transparent"
        style="min-width: 100%"
      >
        <template v-slot:group.header="h" class="transparent">
          <div class="primary sliced">
            <v-icon dark left>mdi-chevron-right</v-icon>
            <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
              <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
              <span v-else v-html="h.group" />
            </span>
            <span v-else>NONE</span>
          </div>
        </template>
        <template v-slot:item.Name="{ item }">
          <span
            class="accent--text heading clickable ml-n2"
            @click="
              $vuetify.goTo(`#e_${item.ID}`, {
                duration: 150,
                easing: 'easeInOutQuad',
                offset: 25,
                container: '.v-dialog--active',
              })
            "
          >
            {{ item.Name }}
          </span>
        </template>
      </v-data-table>
    </div>
    <br />
    <div v-if="!encounters.length" class="subtle--text heading h2 text-center">
      // NO ENCOUNTERS AVAILABLE //
    </div>
    <v-row
      v-for="(encounter, i) in encounters"
      :id="`e_${encounter.ID}`"
      :key="`${encounter.ID}_${i}`"
    >
      <v-col class="pl-0 mb-2">
        <encounter-panel :encounter="encounter" @select="$emit('select', $event)" />
      </v-col>
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import EncounterPanel from './EncounterPanel.vue'
import { getModule } from 'vuex-module-decorators'
import { EncounterStore } from '@/store'

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
})
</script>
