<template>
  <selector title="Pilot CORE Bonuses" height="60vh" :success="!pilot.IsMissingCBs">
    <template v-slot:left-column>
      <v-row v-for="b in pilot.CoreBonuses" :key="`summary_${b.id}`">
        <missing-item v-if="b.err" @remove="remove(b)" />
        <span v-else>
          <v-icon small color="primary">cci-corebonus</v-icon>
          <strong>{{ b.Name }}</strong>
          <span class="overline">{{ b.Source }}</span>
        </span>
      </v-row>
      <v-divider v-if="pilot.CoreBonuses.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-alert
          outlined
          color="success"
          icon="check_circle"
          class="stat-text"
          :value="!pilot.IsMissingCBs"
        >CORE Bonus Selection Complete</v-alert>
        <v-alert
          outlined
          color="primary"
          icon="warning"
          class="stat-text"
          :value="pilot.IsMissingCBs"
        >{{ pilot.CurrentCBPoints }} / {{ pilot.MaxCBPoints }} CORE Bonuses selected</v-alert>
        <v-btn
          block
          text
          small
          :disabled="!pilot.CoreBonuses.length"
          @click="pilot.ClearCoreBonuses()"
        >Reset</v-btn>
      </v-row>
    </template>

    <template v-slot:right-column>
      <core-bonus-select-item
        v-for="b in coreBonuses"
        :key="b.ID"
        :bonus="b"
        :available="pilot.IsMissingCBs"
        :selectable="getSelectableStatus(b)"
        :is-selected="getSelectedStatus(b)"
        @add="pilot.AddCoreBonus(b)"
        @remove="pilot.RemoveCoreBonus(b)"
      />
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import CoreBonusSelectItem from './components/_TalentSelectItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { CoreBonus, Pilot } from '@/class'

export default Vue.extend({
  name: 'talent-selector',
  components: { Selector, CoreBonusSelectItem, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    coreBonuses: [],
  }),
  computed: {
    selectionComplete(): boolean {
      return this.levelUp && !this.pilot.IsMissingCBs
    },
  },
  watch: {
    selectionComplete() {
      window.scrollTo(0, document.body.scrollHeight)
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.coreBonuses = compendium.CoreBonuses
  },
  methods: {},
})
</script>
