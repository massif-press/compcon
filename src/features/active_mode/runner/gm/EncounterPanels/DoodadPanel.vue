<template>
  <panel-base :encounter-instance="encounterInstance"
    :item="combatant.actor">
    <template #name-block>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">Doodad</div>
    </template>
  </panel-base>
</template>

<script setup lang="ts">
import PanelBase from './_PanelBase.vue';

const props = defineProps<{
  combatant: object
  encounterInstance: object
}>()

const emit = defineEmits<{
  'deselect': []
}>()
</script>
