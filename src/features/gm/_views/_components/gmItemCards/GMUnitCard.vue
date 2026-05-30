<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <div v-if="item.NpcClassController.Class" class="my-1">
      T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
    </div>
    <div class="my-1">
      <v-chip
        v-for="t in item.NpcTemplateController.Templates"
        :key="t.ID"
        size="x-small"
        variant="plain"
        label
        flat
        color="primary"
        class="mr-2">
        <v-icon icon="cc:npc_template" start />
        {{ t.Name }}
      </v-chip>
    </div>
  </gm-card-base>
</template>

<script setup lang="ts">
import GmCardBase from './_GMCardBase.vue';

defineOptions({ name: 'gm-unit-card' })

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
