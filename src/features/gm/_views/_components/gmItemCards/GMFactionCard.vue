<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    {{ item.FactionType }}
  </gm-card-base>
</template>

<script setup lang="ts">
import GmCardBase from './_GMCardBase.vue';

defineOptions({ name: 'gm-faction-card' })

const props = withDefaults(defineProps<{
  item: object
  big?: boolean
  grouping?: object | string
  sorting?: object
}>(), {
  grouping: '',
  sorting: ''
})

const emit = defineEmits<{
  'open': []
}>()
</script>
