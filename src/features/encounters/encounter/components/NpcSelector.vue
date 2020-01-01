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
        <v-col cols="auto">
          <roster-group @set="grouping = $event" />
        </v-col>
      </v-row>
      <v-divider class="my-2 " />
      <v-data-table
        dense
        :items="npcs"
        :headers="headers"
        :group-by="grouping"
        :search="search"
        no-results-text="No NPCs Found"
        no-data-text="No Saved NPCs"
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
    <div v-if="!npcs.length" class="grey--text heading h2 text-center">
      // NO NPCS AVAILABLE //
    </div>
    <v-row v-for="(npc, i) in npcs" :id="`e_${npc.ID}`" :key="`${npc.ID}_${i}`">
      <v-col class="pl-0 mb-2">
        <npc-panel :npc="npc">
          <div>
            <v-divider class="my-2" />
            <v-row align="center" dense>
              <v-col cols="9" class="mt-n6">
                <v-btn block large :color="side.toLowerCase()" dark @click="select(npc)">
                  <v-icon left>mdi-plus</v-icon>
                  Add NPC
                </v-btn>
              </v-col>
              <v-col>
                <v-select
                  v-model="side"
                  label="As..."
                  outlined
                  dense
                  :items="['Enemy', 'Ally', 'Neutral']"
                />
              </v-col>
            </v-row>
          </div>
        </npc-panel>
      </v-col>
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcPanel from './NpcPanel.vue'
import RosterGroup from '../../npc/components/RosterGroup.vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore } from '@/store'
import { Npc } from '@/class'

export default Vue.extend({
  name: 'npc-selector',
  components: { NpcPanel, RosterGroup },
  data: () => ({
    npcs: [],
    side: 'Enemy',
    grouping: null,
    headers: [{ text: 'Name', value: 'Name', align: 'left' }],
    search: '',
  }),
  created() {
    const compendium = getModule(NpcStore, this.$store)
    this.npcs = compendium.Npcs
  },
  methods: {
    select(npc: Npc) {
      const newNpc = Npc.Deserialize(Npc.Serialize(npc))
      newNpc.RenewID()
      newNpc.Side = this.side
      this.$emit('select', newNpc)
    },
  },
})
</script>
