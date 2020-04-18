<template>
  <v-container fluid>
    <v-btn-toggle v-model="tier" dense active-class="accent--text">
      <v-btn :value="1">
        <v-icon left>cci-rank-1</v-icon>
        Tier 1
      </v-btn>
      <v-btn :value="2">
        <v-icon left>cci-rank-2</v-icon>
        Tier 2
      </v-btn>
      <v-btn :value="3">
        <v-icon left>cci-rank-3</v-icon>
        Tier 3
      </v-btn>
    </v-btn-toggle>
    <v-row class="mx-2 mt-n2 mb-2" no-gutters>
      <v-col cols="auto">
        <h1 class="heading">NPC Classes</h1>
      </v-col>
      <v-col cols="3" class="ml-auto mr-5">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-icon="search"
          flat
          hide-actions
          single-line
          placeholder="Search"
          clearable
          persistent-hint
          :hint="`${fItems.length} Items`"
        />
      </v-col>
      <!-- <cc-filter-panel v-if="!noFilter" :item-type="itemType" @set-filters="setFilters" /> -->
    </v-row>
    <v-data-table
      v-resize="onResize"
      :headers="headers"
      :items="fItems"
      item-key="ID"
      :height="tableHeight"
      hide-default-footer
      disable-pagination
      class="elevation-0 flavor-text background"
      calculate-widths
      fixed-header
      multi-sort
      show-select
      single-select
    >
      <template v-slot:item.data-table-select="{ item }">
        <v-btn x-small fab color="primary" dark @click="$refs[`modal_${item.ID}`].show()">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <cc-search-result-modal :ref="`modal_${item.ID}`" :item="item" />
      </template>
      <template v-slot:item.Name="{ item }">
        <span class="stat-text">{{ item.Name }}</span>
      </template>
      <template v-slot:item.Role="{ item }">
        <span style="text-transform: uppercase">{{ item.Role }}</span>
      </template>
      <template v-slot:item.HP="{ item }">
        {{ item.Stats.HP(tier) }}
      </template>
      <template v-slot:item.Armor="{ item }">
        {{ item.Stats.Armor(tier) }}
      </template>
      <template v-slot:item.Structure="{ item }">
        {{ item.Stats.Structure(tier) }}
      </template>
      <template v-slot:item.Heatcap="{ item }">
        {{ item.Stats.HeatCapacity(tier) }}
      </template>
      <template v-slot:item.Stress="{ item }">
        {{ item.Stats.Stress(tier) }}
      </template>
      <template v-slot:item.Evasion="{ item }">
        {{ item.Stats.Evade(tier) }}
      </template>
      <template v-slot:item.EDef="{ item }">
        {{ item.Stats.EDefense(tier) }}
      </template>
      <template v-slot:item.Speed="{ item }">
        {{ item.Stats.Speed(tier) }}
      </template>
      <template v-slot:item.Sensor="{ item }">
        {{ item.Stats.Sensor(tier) }}
      </template>
      <template v-slot:item.Save="{ item }">
        {{ item.Stats.Save(tier) }}
      </template>
      <template v-slot:item.Hase="{ item }">
        {{ item.Stats.Hull(tier) }}/{{ item.Stats.Agility(tier) }}/{{ item.Stats.Systems(tier) }}/{{
          item.Stats.Engineering(tier)
        }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { NpcClass } from '@/class'
import { accentInclude } from '@/classes/utility/accent_fold'

@Component({
  components: { CompendiumBrowser },
})
export default class NpcClasses extends Vue {
  private tier = 1
  private search = ''
  private tableHeight = 450
  public headers = [
    { text: 'Class', align: 'left', value: 'Name' },
    { text: 'Role', align: 'left', value: 'Role' },
    { text: 'HP', align: 'left', value: 'HP' },
    { text: 'Armor', align: 'left', value: 'Armor' },
    { text: 'Struct.', align: 'left', value: 'Structure' },
    { text: 'HeatCap.', align: 'left', value: 'Heatcap' },
    { text: 'Stress', align: 'left', value: 'Stress' },
    { text: 'Evade', align: 'left', value: 'Evasion' },
    { text: 'E-Def', align: 'left', value: 'EDef' },
    { text: 'Speed', align: 'left', value: 'Speed' },
    { text: 'Sensor', align: 'left', value: 'Sensor' },
    { text: 'Save', align: 'left', value: 'Save' },
    { text: 'H/A/S/E', align: 'left', value: 'Hase', sortable: false },
  ]
  private compendium = getModule(CompendiumStore, this.$store)
  public get classes(): NpcClass[] {
    return this.compendium.NpcClasses
  }

  public get fItems(): NpcClass[] {
    if (this.search) return this.classes.filter(x => accentInclude(x.Name, this.search))
    return this.classes
  }

  onResize(): void {
    this.tableHeight = window.innerHeight - 160
  }

  mounted(): void {
    this.onResize()
  }
}
</script>
