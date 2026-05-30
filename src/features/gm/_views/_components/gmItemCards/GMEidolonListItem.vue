<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      <cc-missing-content-hover :item="item" />
      <cc-remote-hover :item="item" color="accent" />
      {{ item.Name }}&mdash; T{{ item.Tier }}
      <cc-slashes />
      CLASS {{ item.Class }}
    </template>
    <v-chip
      v-if="!item.BrewController.IsUnableToLoad"
      v-for="l in item.Layers"
      :key="l.ID"
      label
      prepend-icon="mdi-layers"
      class="mx-1 my-1">
      {{ l.Layer?.Name || 'Unknown' }}
    </v-chip>
  </gm-list-item-base>
</template>

<script setup lang="ts">
import GmListItemBase from './_GMListItemBase.vue';

defineOptions({ name: 'gm-doodad-list-item' })

const props = withDefaults(defineProps<{
  item: object
  big?: boolean
  odd?: boolean
  grouping?: object | string
  sorting?: object | string
}>(), {
  grouping: '',
  sorting: ''
})

const emit = defineEmits<{
  'open': []
}>()
</script>
