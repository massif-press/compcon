<template>
  <v-card-text class="py-0">
    <v-layout class="stat-text" fill-height>
      <v-flex shrink>
        <span class="heading h2">{{ item.Source }} {{ item.MechTypeString }} Frame</span>
      </v-flex>
      <v-spacer />
      <v-flex shrink>
        <v-icon size="80" color="primary" style="line-height: 40px">
          cci-size-{{ item.size === 0.5 ? 'half' : item.size }}
        </v-icon>
      </v-flex>
    </v-layout>

    <div v-if="item.Description">
      <span class="overline ml-n2">COMPENDIUM ENTRY</span>
      <p v-html="item.Description" class="flavor-text" />
    </div>

    <span class="overline ml-n2">BASE FRAME ATTRIBUTES</span>
    <frame-statblock :frame="item" />

    <span class="overline ml-n2">FRAME TRAITS</span>
    <cc-titled-panel
      v-for="(t, i) in item.Traits"
      :key="`trait_${i}`"
      icon="cci-trait"
      :title="t.name"
    >
      <p class="effect-text ma-0 pa-0">{{ t.description }}</p>
    </cc-titled-panel>

    <span class="overline ml-n2">AVAILABLE WEAPON MOUNTS</span>
    <v-layout justify-space-around class="mb-3">
      <v-flex shrink v-for="(m, i) in item.Mounts" :key="m + i">
        <cc-title small>{{ m }} Mount</cc-title>
      </v-flex>
    </v-layout>

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
