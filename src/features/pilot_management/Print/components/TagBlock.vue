<template>
  <div v-if="show()" class="px-4">
    <v-card v-for="(t, index) in (tags as any[])" :key="`tag-${index}`" class="pa-1 my-n1" variant="plain">
      <v-row no-gutters>
        <v-col cols="auto"> <v-icon start size="x-small" icon="mdi-tag-outline" /> </v-col
        ><v-col
          ><div class="text-caption" style="line-height: 14px">
            <b>{{ t.GetName() }}</b
            >: {{ t.GetDescription() }}
          </div></v-col
        >
      </v-row>
    </v-card>
  </div>
  <div v-else class="text-right pb-1">
    <v-chip
      v-for="(t, index) in (tags as any[])"
      :key="`chip-${index}`"
      size="x-small"
      v-show="showTag(t.ID)"
      label
      variant="outlined"
      class="mx-1 bg-white"
    >
      {{ t.GetName() }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import Tag from '@/classes/Tag'

defineOptions({ name: 'tag-block' })

const props = defineProps<{
  tags: Tag[]
  options: object
  mech?: boolean
}>()

function show() {
      if (props.mech) return props.options.mechInclude.some((x) => x.title === 'Show Expanded Tags');
      return props.options.pilotInclude.some((x) => x.title === 'Show Expanded Tags');
    }
function showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    }
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
