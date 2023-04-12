<template>
  <v-card-text>
    <v-row dense align="start">
      <v-col class="heading h1 text-text">
        {{ item.Source }} {{ item.MechTypeString }} Frame
      </v-col>
      <v-col cols="auto" class="mt-n5">
        <cc-tooltip
          :title="`Size ${item.Size === 0.5 ? '½' : item.Size}`"
          :content="glossary('size')"
        >
          <v-icon size="65" color="accent" :icon="item.SizeIcon" />
        </cc-tooltip>
      </v-col>
    </v-row>
    <v-row align="center" class="mt-n4">
      <v-col md="12" lg="8">
        <div v-if="item.InLcp" class="heading h4 text-text">
          {{ item.LcpName }}
        </div>
        <div v-if="item.Description">
          <div class="text-overline ml-n2 my-1 text-text">COMPENDIUM ENTRY</div>
          <p v-html-safe="item.Description" class="flavor-text" />
        </div>
        <br />
        <div>
          <div class="text-overline ml-n2 text-text">COMBAT PROFILE</div>
          <frame-combat-chart :frame="item" />
        </div>
      </v-col>
      <v-col v-if="$vuetify.display.lgAndUp" cols="4">
        <v-img :src="item.DefaultImage" max-width="35vw" />
        <!-- <cc-tooltip simple content="Feature In Development"> -->
        <!-- <frame-gallery-modal :frame="item" /> -->
        <!-- </cc-tooltip> -->
      </v-col>
    </v-row>

    <div class="text-overline ml-n2 text-text">FRAME TRAITS</div>
    <v-row>
      <v-col v-for="t in item.Traits">
        <cc-trait-item
          :trait="t"
          :color="item.Manufacturer.GetColor($vuetify.theme.current.dark)"
          class="mb-2"
        />
      </v-col>
    </v-row>

    <br />
    <div class="text-overline ml-n2 text-text">AVAILABLE WEAPON MOUNTS</div>
    <v-row justify="space-around" class="mb-3">
      <v-col v-for="(m, i) in item.Mounts">
        <v-card color="primary" dark class="clipped">
          <cc-tooltip simple inline :content="get_mount_tooltip(m)">
            <v-card-text class="heading h3 px-8">{{ m }} Mount</v-card-text>
          </cc-tooltip>
        </v-card>
      </v-col>
    </v-row>

    <br />
    <div class="text-overline ml-n2 text-text">ONBOARD CORE SYSTEM</div>
    <frame-core-system-panel :cs="item.CoreSystem" />
  </v-card-text>
</template>

<script lang="ts">
import {
  FrameGalleryModal,
  FrameStatblock,
  FrameCoreSystemPanel,
  FrameCombatChart,
} from '../frame';
import { glossary } from 'lancer-data';

export default {
  name: 'cc-frame-card',
  components: {
    FrameGalleryModal,
    FrameStatblock,
    FrameCoreSystemPanel,
    FrameCombatChart,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    glossary(name: string) {
      return glossary.find((x) => x.name.toLowerCase() === name.toLowerCase())
        .description;
    },

    get_mount_tooltip(mount_type: string) {
      const mount_tooltips = {
        Heavy:
          'Holds one <b>HEAVY</b>, <b>MAIN</b>, or <b>AUXILIARY</b> weapon',
        Main: 'Holds one <b>MAIN</b> or <b>AUXILIARY</b> weapon',
        'Aux/Aux': 'Holds up to two <b>AUXILIARY</b> weapons',
        Aux: 'Holds one <b>AUXILIARY</b> weapon',
        'Main/Aux':
          'Holds one <b>MAIN</b> weapon and one <b>AUXILIARY</b> weapon, or two <b>AUXILIARY</b> weapons',
        Flex: 'Holds either one <b>MAIN</b> weapon or up to two <b>AUXILIARY</b> weapons',
      };
      if (mount_type in mount_tooltips) {
        return mount_tooltips[mount_type];
      }
      return 'Error: Unknown Mount Type';
    },
  },
};
</script>
