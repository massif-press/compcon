<template>
  <cc-title
    small
    color="pilot"
    style="padding-left: 300px !important; margin-left: -300px"
    :class="editable ? '' : 'pl-10'">
    <section-edit-icon v-if="editable" :label="tooltip" @open-selector="$emit('edit')" />
    <slot />
    <span>{{ title }}</span>
  </cc-title>
</template>

<script setup lang="ts">
import SectionEditIcon from './SectionEditIcon.vue';

defineOptions({ name: 'section-header' })

const props = withDefaults(defineProps<{
  editable?: boolean
  tooltip?: string
  title: string
}>(), {
  tooltip: 'Edit'
})

const emit = defineEmits<{
  'edit': []
}>()
</script>
