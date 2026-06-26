<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card v-bind="props"
        :elevation="isHovering ? 12 : 0"
        :variant="isHovering ? 'outlined' : 'plain'"
        height="100%"
        style="position: relative"
        @click="$emit('open', item)">
        <cc-img :aspect-ratio="1"
          :src="item.PortraitController.Image" />
        <v-fade-transition>
          <v-card v-if="isHovering"
            style="position: absolute; bottom: 0; left: 0; right: 0"
            class="pa-2 text-center">
            <div class="heading">{{ item.Name }}</div>
            <div v-if="item.SaveController.IsRemote"
              class="mb-1"
              :style="`letter-spacing: ${big ? '6' : '3'}px !important`">
              <v-chip label
                color="accent"
                size="x-small">
                <v-icon v-if="big"
                  start
                  class="mr-3">mdi-broadcast</v-icon>
                {{ $t('common.remoteResource') }}
              </v-chip>
            </div>
            <div v-if="big">
              <v-divider />
              <slot />
              <v-divider />
              <stat-chips v-if="item.StatController"
                :stat-controller="item.StatController"
                :bonuses="item.FeatureController?.Bonuses || []" />
            </div>
          </v-card>
        </v-fade-transition>
        <sort-chips :grouping="grouping"
          :sorting="sorting"
          :controller="item.BrewController" />
      </v-card>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
import StatChips from './_subcomponents/statChips.vue';
import SortChips from './_subcomponents/sortChips.vue';

defineOptions({ name: 'gm-card-base' })

const props = withDefaults(defineProps<{
  item: object
  big?: boolean
  odd?: boolean
  grouping?: object | string
  sorting?: object
}>(), {
  grouping: '',
  sorting: ''
})

const emit = defineEmits<{
  'open': [payload: any]
}>()
</script>
