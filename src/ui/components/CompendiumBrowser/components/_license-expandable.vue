<template>
  <v-expansion-panel v-for="item in items"
    :key="item.ID"
    flat
    tile
    :height="mobile ? 50 : 80">
    <v-expansion-panel-title :id="item.ID"
      class="hover-parent py-0 pr-0 pl-3"
      hide-actions
      flat>
      <template #default="{ expanded }">
        <v-row :align="mobile ? 'center' : 'start'"
          no-gutters
          style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
          class="gradient-background py-2"
          :class="{ mobile: mobile, selected: selected?.ID === item.ID }">
          <v-col class="px-2"
            cols="auto">
            <div class="text-cc-overline">{{ item.Frame.Source }}</div>
            <div class="heading h2 font-weight-bold">
              {{ item.Frame.Name }}
            </div>
          </v-col>
          <v-col cols="auto"
            md="12"
            class="px-2 ml-auto">
            <cc-chip v-for="(f, index) in item.Frame.MechType"
              :key="`type-${index}`"
              :size="mobile ? 'x-small' : 'small'"
              bg-color="primary"
              variant="elevated"
              class="ma-1">
              {{ f }}
            </cc-chip>
          </v-col>
        </v-row>
        <div class="img"
          :class="expanded && !mobile ? 'img-expanded' : 'img-hover'"
          :style="getBgStyle(item)" />
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-lazy min-height="200">
      <div>
      <v-alert v-if="item && item.Prerequisite"
        variant="outlined"
        density="compact"
        class="text-center mx-10 mt-2 mb-n1"
        color="warning">
        <div v-if="item.Prerequisite.cumulative">
          This License requires at least
          {{ item.Prerequisite.min_rank }} cumulative Ranks of
          {{ item.Prerequisite.source }} licenses
        </div>
        <div v-else>
          This License requires at least one other
          {{ item.Prerequisite.source }} License at Rank {{ item.Prerequisite.min_rank }} or above
        </div>
      </v-alert>

      <cc-license-panel :license="item"
        :ranked="isRanked"
        :rank="isRanked ? getControllerRank(item) : undefined" />

      <v-row dense
        v-if="selectable">
        <v-slide-x-transition>
          <v-col cols="12"
            md="auto">
            <cc-button block
              :size="mobile ? 'x-small' : 'small'"
              color="error"
              :disabled="!getControllerRank(item)"
              prepend-icon="mdi-minus"
              @click="$emit('remove', item)">
              <span v-if="getControllerRank(item)">
                Remove {{ item.Name }} {{ 'I'.repeat(getControllerRank(item)) }}
              </span>
              <span v-else>
                No License Ranks
              </span>

            </cc-button>
          </v-col>
        </v-slide-x-transition>


        <v-col cols="12"
          md="">
          <cc-button block
            size="small"
            color="success"
            :disabled="!controller.IsMissingLicenses || getControllerRank(item) >= item.Unlocks.length"
            prepend-icon="mdi-plus"
            @click="$emit('add', item)">
            <span v-if="getControllerRank(item) < item.Unlocks.length">
              Unlock {{ item.Name }} {{ 'I'.repeat(getControllerRank(item) + 1) }}
            </span>
            <span v-else>
              All Ranks Unlocked
            </span>

          </cc-button>
        </v-col>
      </v-row>
      </div>
      </v-lazy>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
import CCLicensePanel from '../../panels/CCLicensePanel.vue'
import { LicenseController } from '@/classes/pilot/components';

const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
    controller: {
      type: LicenseController,
      required: false,
      default: null,
    },
    selectable: {
      type: Boolean,
    },
    selected: {
      type: Object,
      required: false,
      default: null,
    },
  })

const emit = defineEmits(['add', 'remove'])

const { mobile, portrait } = useMobile()

const isRanked = computed(() => {return !!props.controller;})

function getBgStyle(item) {
  let style = `background-image: url('${item.Frame.DefaultImage}');`
  if (mobile.value)
    style += `height:50px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw);`
  else
    style += `height:80px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw)`
  return style
}
function getControllerRank(item) {if (!props.controller) return 0;
      return props.controller.getLicenseRank(item.Name);}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to right,
      rgba(var(--v-theme-surface), 1),
      rgba(var(--v-theme-surface), 0.75),
      rgba(var(--v-theme-surface), 0.15),
      rgba(var(--v-theme-surface), 0));
}

.gradient-background.mobile {
  background: linear-gradient(to right,
      rgba(var(--v-theme-surface), 1),
      rgba(var(--v-theme-surface), 0.55),
      rgba(var(--v-theme-surface), 1));
}

.img {
  transition: all 0.25s ease-in-out;
}

.img-expanded {
  filter: brightness(115%) saturate(1.1);
}

.selected {
  background: linear-gradient(to right,
      rgba(var(--v-theme-primary), 0.5),
      rgba(var(--v-theme-primary), 0.25),
      rgba(var(--v-theme-primary), 0.15),
      rgba(var(--v-theme-primary), 0));
}
</style>
