<template>
  <div>
    <cc-selector-table
      :items="availableFeatures"
      :headers="headers"
      no-filter
      item-type-fallback="NpcFeature"
      @equip="$emit('equip', $event)"
    >
      <div slot="extra-item" class="mt-2">
        <v-switch v-model="showAll" dense inset hide-details color="warning" class="mr-3">
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="showAll ? 'Showing all features' : 'Showing available features'"
          >
            <v-icon
              class="ml-n2"
              :color="showAll ? 'warning' : 'success'"
              v-html="showAll ? 'mdi-lock-open' : 'mdi-lock'"
            />
          </cc-tooltip>
        </v-switch>
        <v-switch v-model="showDupe" dense inset hide-details color="warning" class="mr-3 mt-n1">
          <cc-tooltip
            slot="label"
            simple
            inline
            :content="showDupe ? 'Showing installed features' : 'Hiding installed features'"
          >
            <v-icon
              class="ml-n2"
              :color="showDupe ? 'warning' : 'success'"
              v-html="showDupe ? 'mdi-hexagon-multiple-outline' : 'mdi-hexagon-multiple'"
            />
          </cc-tooltip>
        </v-switch>
      </div>
    </cc-selector-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { NpcFeature } from '@/class'

export default Vue.extend({
  name: 'npc-freature-selector',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: 'Name', align: 'left', value: 'Name' },
      { text: 'Type', align: 'left', value: 'FeatureType' },
      { text: 'Class', align: 'left', value: 'OriginClass' },
      { text: 'Set', align: 'left', value: 'OriginSet' },
      { text: '', align: 'center', value: 'Detail' },
    ],
    features: [],
    showAll: false,
    showDupe: false,
  }),
  computed: {
    availableFeatures(): NpcFeature[] {
      let i = []
      if (this.showAll) i = this.features
      else {
        const templateFeatures = this.npc.Templates.flatMap(x => x.OptionalFeatures)
        i = templateFeatures.concat(this.npc.Class.OptionalFeatures)
      }
      if (!this.showDupe) i = i.filter(x => !this.npc.SelectedFeatures.some(y => y.ID === x.ID))
      else {
        const tempBaseFeats = this.npc.Templates.flatMap(x => x.BaseFeatures)
        i = i.concat(this.npc.Class.BaseFeatures).concat(tempBaseFeats)
      }
      return i
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.features = compendium.NpcFeatures
  },
})
</script>
