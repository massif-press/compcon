<template>
  <v-card-text>
    <v-row density="compact">
      <v-col md="12" lg="7">
        <v-row density="compact" align="start">
          <v-col>
            <span class="heading h2 text-text">
              {{ item.Source }} {{ item.MechTypeString }} Frame
            </span>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <cc-tooltip
              :title="`Size ${item.Size === 0.5 ? '½' : item.Size}`"
              :content="glossary('size')"
            >
              <v-icon
                size="60"
                color="accent"
                class="mt-n2"
                style="line-height: 40px"
              >
                {{ item.SizeIcon }}
              </v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
        <div v-if="item.InLcp" class="heading h4 text-text">
          {{ item.LcpName }}
        </div>
        <div v-if="item.Description">
          <div class="text-overline ml-n2 my-1 text-text">COMPENDIUM ENTRY</div>
          <p v-html-safe="item.Description" class="flavor-text" />
        </div>
        <div>
          <span class="text-overline ml-n2 text-text">COMBAT PROFILE</span>
          <p class="heading h3 text-subtle light-panel text-center py-10">
            <v-icon large color="grey">mdi-lock</v-icon>
            <br />
            FEATURE IN DEVELOPMENT
          </p>
        </div>
      </v-col>
      <v-col v-if="$vuetify.display.lgAndUp" cols="5">
        <v-img :src="item.DefaultImage" max-width="35vw" />
        <cc-tooltip simple content="Feature In Development">
          <frame-gallery-modal :frame="item" />
        </cc-tooltip>
      </v-col>
    </v-row>

    <span class="text-overline ml-n2 mb-n2 text-text"
      >BASE FRAME ATTRIBUTES</span
    >
    <frame-statblock :frame="item" />

    <span class="text-overline ml-n2 text-text">FRAME TRAITS</span>
    <cc-trait-item
      v-for="(t, i) in item.Traits"
      :trait="t"
      :color="item.Manufacturer.GetColor($vuetify.theme.dark)"
    />

    <span class="text-overline ml-n2 text-text">AVAILABLE WEAPON MOUNTS</span>
    <v-row justify="space-around" class="mb-3">
      <v-col v-for="(m, i) in item.Mounts">
        <v-card color="primary" dark class="clipped">
          <cc-tooltip simple inline :content="get_mount_tooltip(m)">
            <v-card-text class="heading h3 px-8">{{ m }} Mount</v-card-text>
          </cc-tooltip>
        </v-card>
      </v-col>
    </v-row>

    <span class="text-overline ml-n2 text-text">ONBOARD CORE SYSTEM</span>
    <frame-core-system-panel :cs="item.CoreSystem" />
  </v-card-text>
</template>

<script lang="ts">
import {
  FrameGalleryModal,
  FrameStatblock,
  FrameCoreSystemPanel,
} from '../frame';
import { glossary } from 'lancer-data';

export default {
  name: 'cc-frame-card',
  components: { FrameGalleryModal, FrameStatblock, FrameCoreSystemPanel },
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
