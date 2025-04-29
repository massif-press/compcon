<template>
  <div :class="mobile ? 'px-4' : 'px-12'">
    <div :style="!mobile && 'height: 129px; padding-right: 250px'">
      <ident-block :pilot="pilot" />
    </div>
    <v-row>
      <v-col :class="!mobile && 'mt-n10'">
        <clone-block :pilot="pilot" :readonly="pilot.IsRemote" />

        <section-header title="Pilot Biography" />
        <cc-rich-text-area v-model="pilot.History" :readonly="pilot.IsRemote" class="pt-2 mb-3" />

        <section-header title="Pilot Appearance" />
        <cc-rich-text-area
          v-model="pilot.TextAppearance"
          :readonly="pilot.IsRemote"
          class="pt-2 mb-2" />

        <section-header title="Pilot Notes" />
        <cc-rich-text-area v-model="pilot.Notes" :readonly="pilot.IsRemote" class="pt-2 mb-3" />
      </v-col>
      <v-col cols="12" sm="4" :order="mobile && '-1'" :class="!mobile && 'pt-6'">
        <image-block :pilot="pilot" />
      </v-col>
    </v-row>
  </div>
  <div :class="mobile ? '' : 'pt-2 px-12'">
    <skill-block :pilot="pilot" />
    <dt-resources-block :pilot="pilot" />
    <pilot-loadout-block :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import SectionHeader from '../components/SectionHeader.vue';
import SkillBlock from './components/SkillBlock.vue';
import DtResourcesBlock from './components/DtResourcesBlock.vue';
import PilotLoadoutBlock from './components/PilotLoadoutBlock.vue';
import IdentBlock from './components/IdentBlock.vue';
import CloneBlock from './components/CloneBlock.vue';
import ImageBlock from './components/ImageBlock.vue';
import { Pilot } from '@/class';

export default {
  name: 'narrative-view',
  components: {
    SkillBlock,
    DtResourcesBlock,
    PilotLoadoutBlock,
    IdentBlock,
    CloneBlock,
    ImageBlock,
    SectionHeader,
  },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
