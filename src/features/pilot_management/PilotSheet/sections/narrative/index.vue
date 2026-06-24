<template>
  <div :class="mobile ? 'px-4' : 'px-12'">
    <div :style="!mobile && 'height: 129px; padding-right: 250px'">
      <ident-block :pilot="pilot" />
    </div>
    <v-row>
      <v-col>
        <clone-block :pilot="pilot"
          :readonly="pilot.IsRemote" />

        <section-header :title="$t('pm.link.pilotBiography')" />
        <cc-rich-text-area v-model="pilot.History"
          :readonly="pilot.IsRemote"
          class="pt-2 mb-3" />

        <section-header :title="$t('pm.link.pilotAppearance')" />
        <cc-rich-text-area v-model="pilot.TextAppearance"
          :readonly="pilot.IsRemote"
          class="pt-2 mb-2" />

        <section-header :title="$t('pm.print.pilotNotes')" />
        <cc-rich-text-area v-model="pilot.Notes"
          :readonly="pilot.IsRemote"
          class="pt-2 mb-3" />
      </v-col>
      <v-col cols="12"
        sm="4"
        :order="mobile ? '-1' : undefined"
        :class="!mobile && 'pt-6'">
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

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import SectionHeader from '../components/SectionHeader.vue';
import SkillBlock from './components/SkillBlock.vue';
import DtResourcesBlock from './components/DtResourcesBlock.vue';
import PilotLoadoutBlock from './components/PilotLoadoutBlock.vue';
import IdentBlock from './components/IdentBlock.vue';
import CloneBlock from './components/CloneBlock.vue';
import ImageBlock from './components/ImageBlock.vue';
import { Pilot } from '@/classes/pilot/Pilot'

const _display = useDisplay()

defineOptions({ name: 'narrative-view' })

const props = defineProps<{
  pilot: Pilot
}>()

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
</script>
