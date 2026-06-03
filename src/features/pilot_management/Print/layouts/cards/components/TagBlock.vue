<template>
  <div class="pb-1" :style="block ? '' : 'position: absolute; bottom: 0; left: 4px; right: 4px'">
    <v-divider />
    <v-chip
      v-for="t in (tags as any[])"
      :key="t.ID"
      size="x-small"
      v-show="showTag(t.ID)"
      label
      variant="outlined"
      class="bg-white"
      style="width: 100%"
    >
      <v-icon start size="x-small" icon="mdi-tag-outline" />
      {{ t.GetName() }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import Tag from '@/classes/Tag'

defineOptions({ name: 'print-action' })

const props = defineProps<{
  tags: Tag[]
  options: object
  mech?: boolean
  block?: boolean
}>()

function showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    }
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
