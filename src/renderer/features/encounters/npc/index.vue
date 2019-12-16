<template>
  <v-container fluid class="mt-9" style="height: 100%">
    <cc-gm-header title="NPC ROSTER" />
    <v-row>
      <v-col cols="4" class="mt-n4" style="min-height: 87vh; max-height: 87vh; overflow-y: scroll;">
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
        <v-row dense>
          <v-data-table
            dense
            :items="npcs"
            :headers="headers"
            :group-by="grouping"
            :search="search"
            hide-default-footer
            calculate-widths
            class="transparent"
            style="min-width: 100%"
          >
            <template v-slot:group.header="h" class="transparent">
              <div class="primary sliced">
                <v-icon dark left>mdi-chevron-right</v-icon>
                <span class="heading white--text">{{ h.group.toUpperCase() }}</span>
              </div>
            </template>
            <template v-slot:item.Name="{ item }">
              <span class="primary--text heading clickable" @click="selectedNpc = item">
                {{ item.Name }}
              </span>
              <v-scroll-x-transition leave-absolute>
                <v-icon v-if="selectedNpc === item" right color="primary">
                  mdi-chevron-triple-right
                </v-icon>
              </v-scroll-x-transition>
            </template>
            <template v-slot:item.Class="{ item }">
              <span class="caption text-uppercase">{{ item.Class }}</span>
            </template>
            <template v-slot:item.Role="{ item }">
              <cc-tooltip simple :content="item.Role.toUpperCase()">
                <v-icon large :color="`role--${item.Role}`">cci-role-{{ item.Role }}</v-icon>
              </cc-tooltip>
            </template>
            <template v-slot:item.Tier="{ item }">
              <cc-tooltip simple :content="`TIER ${item.Tier} NPC`">
                <v-icon v-if="item.Tier === 'custom'" large color="grey darken-2">
                  mdi-star-circle-outline
                </v-icon>
                <v-icon
                  v-else
                  large
                  :color="item.Tier === 1 ? 'grey' : item.Tier === 2 ? 'grey darken-2' : 'black'"
                >
                  cci-rank-{{ item.Tier }}
                </v-icon>
              </cc-tooltip>
            </template>
            <template v-slot:item.Power="{ item }">
              <span class="caption text-uppercase">{{ item.Power }}</span>
            </template>
          </v-data-table>
        </v-row>
        <v-divider class="mt-3 mb-1" />
        <v-row justify="center">
          <v-col cols="10" class="text-center">
            <v-btn block tile color="primary">
              <v-icon left>mdi-plus</v-icon>
              Add New NPC
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical />
      <v-col id="scrollTarget" class="bordered-view">
        <npc-card v-if="selectedNpc" :npc="selectedNpc" />
        <v-row v-else align="center" justify="center" style="width: 100%; height: 100%;">
          <v-col cols="auto">
            <span class="heading h1 grey--text text--lighten-2">no npc selected</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcCard from './NpcCard.vue'
import RosterGroup from './components/RosterGroup.vue'

export default Vue.extend({
  name: 'npc-manager',
  components: { NpcCard, RosterGroup },
  data: () => ({
    search: '',
    selectedNpc: null,
    grouping: null,
    headers: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Class', value: 'Class' },
      { text: 'Role', value: 'Role' },
      { text: 'Tier', value: 'Tier' },
      { text: 'Power', value: 'Power' },
    ],
    npcs: [
      {
        Name: 'npc a',
        Role: 'striker',
        Class: 'ace',
        Templates: ['Veteran', 'Pirate'],
        Tier: 1,
        Labels: ['a', 'b', 'c'],
        Power: 331,
        PowerTier: '301 - 400',
        Campaign: 'my campaign',
        Data: 'this is some npc a data',
      },
      {
        Name: 'npc b',
        Role: 'support',
        Class: 'scout',
        Templates: ['Grunt'],
        Tier: 1,
        Power: 88,
        PowerTier: '0 - 100',
        Labels: ['a', 'b', 'c'],
        Campaign: 'my campaign',
        Data: 'this is some npc a data',
      },
      {
        Name: 'npc c',
        Role: 'artillery',
        Class: 'operator',
        Tier: 3,
        Templates: [],
        Power: 304,
        PowerTier: '301 - 400',
        Labels: ['a', 'c'],
        Campaign: 'Wallflower',
        Data: 'this is some npc a data',
      },
      {
        Name: 'npc d',
        Role: 'striker',
        Class: 'breacher',
        Templates: ['Elite'],
        Tier: 'custom',
        Power: 944,
        PowerTier: '901 - 1000',
        Labels: ['a', 'f'],
        Campaign: 'Wallflower',
        Data: 'this is some npc a data',
      },
    ],
  }),
  watch: {
    selectedNpc() {
      console.log('npc changed')
      document.getElementById('scrollTarget').scrollTop = 0
    },
  },
})
</script>

<style scoped>
.bordered-view {
  min-height: 87vh;
  max-height: 87vh;
  overflow-y: scroll;
  border: 1px solid darkgrey;
  border-radius: 3px;
}
</style>

<style>
.v-row-group__header,
.v-row-group__summary {
  background: transparent !important;
}
</style>
