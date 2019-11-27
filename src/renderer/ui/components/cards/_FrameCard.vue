<template>
  <v-card-text>
    <v-row class="stat-text" fill-height>
      <span class="heading h2">{{ item.Source }} {{ item.MechTypeString }} Frame</span>
      <v-icon size="80" color="primary" class="ml-auto" style="line-height: 40px">
        cci-size-{{ item.size === 0.5 ? 'half' : item.Size }}
      </v-icon>
    </v-row>

    <div v-if="item.Description">
      <span class="overline ml-n2">COMPENDIUM ENTRY</span>
      <p class="flavor-text" v-html="item.Description" />
    </div>

    <span class="overline ml-n2">BASE FRAME ATTRIBUTES</span>
    <frame-statblock :frame="item" />

    <span class="overline ml-n2">FRAME TRAITS</span>
    <cc-trait-item v-for="(t, i) in item.Traits" :key="`trait_${i}`" :trait="t" />

    <span class="overline ml-n2">AVAILABLE WEAPON MOUNTS</span>
    <v-row justify-space-around class="mb-3">
      <v-col v-for="(m, i) in item.Mounts" :key="m + i">
        <cc-title small>{{ m }} Mount</cc-title>
      </v-col>
    </v-row>

    <span class="overline ml-n2">ONBOARD CORE SYSTEM</span>
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
