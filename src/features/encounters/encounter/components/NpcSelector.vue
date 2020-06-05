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
              $vuetify.goTo(`#${generateNpcElementId(item)}`, {
                duration: 150,
                easing: 'easeInOutQuad',
                offset: 25,
                container: $el.closest('.v-dialog--active'),
              })
            "
          >
            <v-icon v-html="item.Class.RoleIcon" />
            <v-icon left v-html="`cci-rank-${item.Tier}`" />
            {{ item.Name }}
          </span>
        </template>
      </v-data-table>
    </div>
    <br />
    <div v-if="!npcs.length" class="subtle--text heading h2 text-center">
      // NO NPCS AVAILABLE //
    </div>
    <v-row v-for="(npc, i) in npcs" :id="generateNpcElementId(npc)" :key="`${npc.ID}_${i}`">
      <v-col class="pl-0 mb-2">
        <npc-panel :npc="npc">
          <div>
            <v-divider class="my-2" />
            <v-row align="center" dense>
              <v-col cols="9" class="mt-n6">
                <v-btn
                  block
                  x-large
                  tile
                  outlined
                  :color="side.toLowerCase()"
                  dark
                  @click="$emit('select', { npc, side })"
                >
                  <v-icon large left>mdi-plus</v-icon>
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
    generateNpcElementId: function(npc) {
      return `e_${this._uid}_${npc.ID}`
    },
  },
})
</script>
