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
      {{ item.Name }}
      <span v-if="item.NpcClassController.Class">
        &mdash; T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
      </span>
      <span class="px-4">
        <v-chip
          v-for="t in item.NpcTemplateController.Templates"
          :key="t.ID"
          size="x-small"
          variant="plain"
          label
          color="primary"
          class="mr-3 mt-n1">
          <v-icon icon="cc:npc_template" start />
          {{ t.Name }}
        </v-chip>
      </span>
    </template>
    <div class="text-caption pt-1">
      <stat-chips
        :stat-controller="item.StatController"
        :bonuses="item.FeatureController.Bonuses" />
    </div>
  </gm-list-item-base>
</template>

<script setup lang="ts">
import StatChips from './_subcomponents/statChips.vue';
import GmListItemBase from './_GMListItemBase.vue';

defineOptions({ name: 'gm-unit-list-item' })

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
