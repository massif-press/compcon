<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <div>
      T{{ item.Tier }}
      <cc-slashes />
      CLASS {{ item.Class }}
    </div>
    <v-chip
      v-for="l in item.Layers"
      :key="l.ID"
      size="x-small"
      label
      prepend-icon="mdi-layers"
      class="mx-1 my-1">
      {{ l.Layer.Name }}
    </v-chip>
  </gm-card-base>
</template>

<script setup lang="ts">
import GmCardBase from './_GMCardBase.vue';

defineOptions({ name: 'gm-eidolon-card' })

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
