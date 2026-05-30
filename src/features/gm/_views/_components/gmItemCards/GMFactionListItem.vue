<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      <div>
        <cc-remote-hover :item="item" color="accent" />
        {{ item.Name }}
        <span class="text-caption text-uppercase text-disabled">
          <cc-slashes class="mx-1" />
          {{ item.FactionType }}
        </span>
      </div>
    </template>
  </gm-list-item-base>
</template>

<script setup lang="ts">
import SortChips from './_subcomponents/sortChips.vue';
import GmListItemBase from './_GMListItemBase.vue';

defineOptions({ name: 'gm-location-list-item' })

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
