<template>
  <v-tooltip v-if="remoteResource"
    location="top"
    max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        :color="color"
        size="small">mdi-broadcast</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold"
        style="letter-spacing: 3px">
        <span v-if="collectionResource">{{ $t('ui.remote.collectionResource') }}</span>
        <span v-else>{{ $t('common.remoteResource') }}</span>
      </div>
      <v-divider />
      <i v-if="collectionResource"
        class="text-caption">{{ $t('ui.remote.collectionHelp', { type: itemType }) }}</i>
      <i v-else
        class="text-caption">{{ $t('ui.remote.remoteHelp', { type: itemType }) }}</i>
    </div>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  item?: object
  color?: string
}>(), {
  color: ''
})

const remoteResource = computed(() => {
      return props.item && props.item.SaveController && props.item.SaveController.IsRemote;
    })
const collectionResource = computed(() => {
      return props.item && props.item.SaveController && props.item.SaveController.IsCollectionItem;
    })
const itemType = computed(() => {
      return (props.item as any).ItemType.toLowerCase() || 'item';
    })
</script>
