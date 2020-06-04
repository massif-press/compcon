<template>
  <v-card-text>
    <v-row dense>
      <v-col md="12" lg="7">
        <v-row dense align="center">
          <v-col>
            <span class="heading h2 text--text">
              {{ item.Source }} {{ item.MechTypeString }} Frame
            </span>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <v-icon size="60" color="accent" class="mt-n2" style="line-height: 40px">
              {{ item.SizeIcon }}
            </v-icon>
          </v-col>
        </v-row>
        <div v-if="item.Description">
          <span class="overline ml-n2 text--text">COMPENDIUM ENTRY</span>
          <p class="flavor-text" v-html="item.Description" />
        </div>
        <div>
          <span class="overline ml-n2 text--text">COMBAT PROFILE</span>
          <p class="heading h3 subtle--text light-panel text-center py-10">
            <v-icon large color="grey">mdi-lock</v-icon>
            <br />
            FEATURE IN DEVELOPMENT
          </p>
        </div>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="5">
        <v-img :src="item.DefaultImage" max-width="35vw" />
        <cc-tooltip simple content="Feature In Development">
          <frame-gallery-modal :frame="item" />
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
        <v-chip large label outlined color="accent" class="heading h3">{{ m }} Mount</v-chip>
      </v-col>
    </v-row>

    <span class="overline ml-n2 text--text">ONBOARD CORE SYSTEM</span>
    <frame-core-system-panel :cs="item.CoreSystem" />
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
import { FrameGalleryModal, FrameStatblock, FrameCoreSystemPanel } from './frame'

export default Vue.extend({
  name: 'cc-frame-card',
  components: { FrameGalleryModal, FrameStatblock, FrameCoreSystemPanel },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
