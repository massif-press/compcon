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
          {{ item.Pronouns }}
        </span>
      </div>
      <div class="pl-1 text-body-2">
        <i>{{ item.Title }}</i>
      </div>
    </template>
  </gm-list-item-base>
</template>

<script setup lang="ts">
import GmListItemBase from './_GMListItemBase.vue';

defineOptions({ name: 'gm-character-list-item' })

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
