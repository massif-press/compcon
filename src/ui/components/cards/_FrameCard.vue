<template>
  <v-card-text>
    <v-row>
      <v-col cols="7">
        <v-row>
          <span class="heading h2 text--text">
            {{ item.Source }} {{ item.MechTypeString }} Frame
          </span>
          <v-icon size="60" color="primary" class="ml-auto mt-n2" style="line-height: 40px">
            cci-size-{{ item.Size === 0.5 ? 'half' : item.Size }}
          </v-icon>
        </v-row>
        <div v-if="item.Description">
          <span class="overline ml-n2 text--text">COMPENDIUM ENTRY</span>
          <p class="flavor-text" v-html="item.Description" />
        </div>
        <div>
          <span class="overline ml-n2 text--text">COMBAT PROFILE</span>
          <p class="heading h3 grey--text light-panel text-center py-10">
            <v-icon large color="grey">mdi-lock</v-icon>
            <br />
            FEATURE IN DEVELOPMENT
          </p>
        </div>
      </v-col>
      <v-col cols="5">
        <v-img :src="item.DefaultImage" />
        <cc-tooltip simple content="Feature In Development">
          <v-btn small outlined block disabled>View {{ item.Name }} Gallery</v-btn>
        </cc-tooltip>
      </v-col>
    </v-row>

    <span class="overline ml-n2 mb-n2 text--text">BASE FRAME ATTRIBUTES</span>
    <frame-statblock :frame="item" />

    <span class="overline ml-n2 text--text">FRAME TRAITS</span>
    <cc-trait-item
      v-for="(t, i) in item.Traits"
      :key="`trait_${i}`"
      :trait="t"
      :color="item.Manufacturer.Color"
    />

    <span class="overline ml-n2 text--text">AVAILABLE WEAPON MOUNTS</span>
    <v-row justify="space-around" class="mb-3">
      <v-col v-for="(m, i) in item.Mounts" :key="m + i" cols="auto">
        <v-chip large label outlined color="primary" class="heading h3">{{ m }} Mount</v-chip>
      </v-col>
    </v-row>

    <span class="overline ml-n2 text--text">ONBOARD CORE SYSTEM</span>
    <frame-core-system-panel :cs="item.CoreSystem" />
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
import { FrameStatblock, FrameCoreSystemPanel } from './frame'

export default Vue.extend({
  name: 'cc-frame-card',
  components: { FrameStatblock, FrameCoreSystemPanel },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
