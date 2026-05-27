<template>
  <div v-if="item.Actions?.length"
    class="mb-2 mt-1">
    <cc-combat-action-chip v-for="a in item.Actions"
      :key="a.ID"
      :action="a"
      :owner="combatant"
      :encounter="encounterInstance" />
  </div>
  <div v-if="item.Deployables?.length"
    class="mb-2">
    <deploy-button v-for="d in item.Deployables"
      :key="d.ID"
      :deployable="d"
      :actor="actor"
      @deploy="$emit('deploy', $event)" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any
  combatant: any
  encounterInstance: any
  actor: any
}>()
defineEmits<{ deploy: [deployable: any] }>()
</script>
