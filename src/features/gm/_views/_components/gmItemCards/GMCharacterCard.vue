<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    {{ item.Title }}
    <br v-if="item.Title" />
    <i class="text-caption">({{ item.Pronouns }})</i>
  </gm-card-base>
</template>

<script setup lang="ts">
import GmCardBase from './_GMCardBase.vue';

defineOptions({ name: 'gm-character-card' })

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
  'open': []
}>()
</script>
