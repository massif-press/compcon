<template>
  <v-expansion-panel class="border-highlight">
    <v-expansion-panel-header id="hover-parent" style="height:65px;" hide-actions>
      <v-row style="position:absolute; z-index: 10" class="py-2">
        <v-col cols="1" class="ml-n3 mr-4">
          <v-icon v-if="rank" size="50" color="accent" class="d-inline">cci-rank-{{ rank }}</v-icon>
          <cc-logo
            v-else
            size="xLarge"
            color="grey"
            class="d-inline"
            :source="license.Manufacturer"
          />
        </v-col>
        <v-col class="ml-2">
          <span class="caption">{{ frame(license.FrameID).Source }}</span>
          <br />
          <span class="heading h2 font-weight-bold pop">{{ license.Name }}</span>
          <v-chip
            v-for="f in frame(license.FrameID).Mechtype"
            :key="f"
            small
            dark
            outlined
            color="accent"
            class="mr-2 pop"
          >
            {{ f }}
          </v-chip>
        </v-col>
      </v-row>
      <v-img
        id="img-hover"
        :src="frame(license.FrameID).DefaultImage"
        max-height="100%"
        :position="`top ${frame(license.FrameID).YPosition}% left 200px`"
        style="position:absolute; top: 0; right: 0; z-index: 9"
      />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <cc-license-panel :license="license" ranked :rank="rank" />
      <v-btn
        v-if="rank < license.Unlocks.length && isSelectable"
        block
        outlined
        color="secondary"
        @click="$emit('add')"
      >
        <v-icon left>cci-accuracy</v-icon>
        Unlock {{ license.Name }} {{ 'I'.repeat(rank + 1) }}
      </v-btn>
      <v-btn v-if="rank" block outlined color="error" @click="$emit('remove')">
        <v-icon left>cci-difficulty</v-icon>
        Remove {{ license.Name }} {{ 'I'.repeat(rank) }}
      </v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'license-select-item',
  props: {
    license: {
      type: Object,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    isSelectable: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    frame(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID('Frames', id)
    },
  },
})
</script>

<style scoped>
#img-hover {
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
}

#hover-parent:hover > #img-hover {
  opacity: 1;
}

.border-primary #img-hover {
  opacity: 1;
}

.pop {
  text-shadow: -1px -1px 0 var(--v-anti-base), 1px -1px 0 var(--v-anti-base),
    -1px 1px 0 var(--v-anti-base), 1px 1px 0 var(--v-anti-base);
}
</style>
