<template>
  <v-row dense align="center">
    <v-col>
      <div class="heading h2">{{ item.Source }} {{ item.MechTypeString }} Frame</div>
      <div class="heading h4 text-text">
        {{ item.LcpName }}
      </div>
    </v-col>
    <v-col cols="auto">
      <cc-tooltip :icon="item.SizeIcon" size="65">
        <div class="heading h3">Size {{ item.Size === 0.5 ? '½' : item.Size }}</div>
        <v-divider class="my-1" />
        {{ glossary('size') }}
      </cc-tooltip>
    </v-col>
  </v-row>
  <v-row align="start" dense>
    <v-col>
      <div v-if="item.Description">
        <div class="text-overline ml-n2 my-1 text-text">COMPENDIUM ENTRY</div>
        <p v-html-safe="item.Description" class="flavor-text" />
      </div>
    </v-col>
    <v-col :order="mobile ? 'first' : 'last'" cols="12" md="5">
      <v-img :src="item.DefaultImage" max-height="100vh" />
    </v-col>
  </v-row>

  <div class="my-4">
    <div class="text-overline ml-n2 text-text">COMBAT PROFILE</div>
    <frame-combat-chart :frame="item" />
  </div>

  <div class="text-overline ml-n2 text-text">FRAME TRAITS</div>
  <masonry-wall
    :items="item.Traits"
    :column-width="500"
    :gap="16"
    :min-columns="1"
    :max-columns="2">
    <template #default="{ item, index }">
      <cc-trait-item :trait="item" :color="mColor" style="height: 100%" />
    </template>
  </masonry-wall>

  <br />
  <div class="text-overline ml-n2 text-text">AVAILABLE WEAPON MOUNTS</div>
  <v-row justify="space-around" class="mb-3">
    <v-col v-for="m in item.Mounts">
      <v-tooltip location="bottom" max-width="300">
        <template #activator="{ props }">
          <v-card color="primary" dark class="clipped" tile v-bind:="props">
            <v-card-text class="heading h3 px-8 text-uppercase">{{ m }} Mount</v-card-text>
          </v-card>
        </template>
        <p v-html="get_mount_tooltip(m)" />
      </v-tooltip>
    </v-col>
  </v-row>

  <div class="text-overline ml-n2 text-text">ONBOARD CORE SYSTEM</div>
  <frame-core-system-panel :cs="item.CoreSystem" />
</template>

<script lang="ts">
import {
  FrameGalleryModal,
  FrameStatblock,
  FrameCoreSystemPanel,
  FrameCombatChart,
} from '../frame';
import { glossary } from '@massif/lancer-data';

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
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    mColor() {
      this.item.Manufacturer.GetColor(this.$vuetify.theme.current.dark);
    },
  },
  methods: {
    glossary(name: string) {
      return glossary.find((x) => x.name.toLowerCase() === name.toLowerCase()).description;
    },

    get_mount_tooltip(mount_type: string) {
      const mount_tooltips = {
        Heavy: 'Holds one <b>HEAVY</b>, <b>MAIN</b>, or <b>AUXILIARY</b> weapon',
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
