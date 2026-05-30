<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      <cc-remote-hover :item="item" color="accent" />
      {{ item.Name }}
    </template>
    <div class="text-caption">
      <stat-chips :stat-controller="item.StatController" />
    </div>
  </gm-list-item-base>
</template>

<script setup lang="ts">
import StatChips from './_subcomponents/statChips.vue';
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
