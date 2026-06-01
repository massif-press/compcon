<template>
  <fieldset>
    <legend class="heading h3 ml-1 px-2">Systems</legend>
    <v-card
      v-for="s in mech.MechLoadoutController.ActiveLoadout.AllActiveSystems.filter(Boolean)"
      :key="s.ID"
      variant="outlined"
      class="pa-1 my-1 no-print-break"
      style="position: relative; border-color: rgba(0, 0, 0, 0.2)">
      <v-row>
        <v-col cols="auto">
          <v-icon icon="cc:system"
            class="mt-n1"
            start />
          <b class="heading h4"
            style="line-height: 0">{{ s.Name }}</b>
        </v-col>
        <v-col cols="auto">
          <span class="text-overline"
            style="line-height: 0">{{ s.Source }} {{ s.Type }}</span>
        </v-col>
        <v-col v-if="s.Uses"
          cols="auto"
          class="ml-auto">
          <v-icon
            v-for="n in s.getTotalUses(mech.LimitedBonus)"
            :key="`use-${n}`"
            size="small"
            color="primary">
            mdi-hexagon-outline
          </v-icon>
        </v-col>
      </v-row>
      <div class="pl-7">
        <p v-if="s.Effect"
          class="caption mb-n1"
          v-html-safe="s.Effect" />
        <print-action :actions="s.Actions" />
        <print-deployable :deployables="s.Deployables" />
        <tag-block :tags="s.Tags"
          :options="options"
          mech />
      </div>
    </v-card>
  </fieldset>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import PrintAction from './PrintAction.vue';
import PrintDeployable from './PrintDeployable.vue';
import TagBlock from './TagBlock.vue';

const props = defineProps<{
  mech: Mech
  options: object
}>()
</script>
