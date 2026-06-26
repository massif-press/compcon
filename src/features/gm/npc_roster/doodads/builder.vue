<template>
  <div class="heading mech mb-4" style="min-width: 30vw; line-height: 1em">
    <cc-short-string-editor
      :readonly="readonly"
      large
      justify="start"
      :placeholder="item.Name"
      @set="item.Name = $event">
      <div class="heading-block">
        {{ item.Name }}
      </div>
    </cc-short-string-editor>
  </div>
</template>

<script setup lang="ts">
import type { Doodad } from '@/classes/npc/doodad/Doodad'
defineOptions({ name: 'doodad-builder-content' })

const props = withDefaults(defineProps<{
  item: Doodad
  readonly?: boolean
}>(), {
  readonly: false
})
</script>
