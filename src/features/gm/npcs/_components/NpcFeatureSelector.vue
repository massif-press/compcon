<template>
  <v-container>
    <v-row dense>
      <v-col cols="auto">
        <v-btn-toggle v-model="cSelection" multiple dense>
          <v-btn value="base">Base</v-btn>
          <v-btn value="optional">Optional</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="tSelection" multiple dense>
          <v-btn value="trait">Trait</v-btn>
          <v-btn value="system">System</v-btn>
          <v-btn value="reaction">Reaction</v-btn>
          <v-btn value="weapon">Weapon</v-btn>
          <v-btn value="tech">Tech</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-container>
      <v-row>
        <v-col
          v-for="(item, i) in shownFeatures"
          :key="`${item.Feature.ID}_${i}`"
          xl="4"
          cols="6"
          class="fill-height"
        >
          <cc-npc-item-card :item="item" full-height @remove-feature="npc.RemoveFeature(item)" />
        </v-col>
        <v-col v-if="hiddenFeatures" cols="12" class="my-4">
          <v-card color="panel" flat height="50px">
            <v-row style="height: 100%" align="center" justify="center">
              <v-col cols="auto">
                <i>+{{ hiddenFeatures }} Hidden Features</i>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <npc-feature-select-menu :npc="npc" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcFeatureSelectMenu from './_subcomponents/NpcFeatureSelectMenu.vue'

export default Vue.extend({
  name: 'npc-feature-selector',
  components: { NpcFeatureSelectMenu },
  props: {
    npc: { type: Object, required: true },
  },
  data: () => ({
    cSelection: ['base', 'optional'],
    tSelection: ['trait', 'system', 'reaction', 'weapon', 'tech'],
  }),
  computed: {
    shownFeatures() {
      let items = this.npc.Items.filter(x =>
        this.tSelection.some(y => y === x.Feature.FeatureType.toLowerCase())
      )
      if (!this.cSelection.includes('base')) items = items.filter(x => x.Feature.Origin.Optional)
      if (!this.cSelection.includes('optional'))
        items = items.filter(x => !x.Feature.Origin.Optional)
      return items
    },
    hiddenFeatures() {
      return this.npc.Items.length - this.shownFeatures.length
    },
  },
})
</script>
