<template>
  <cc-alert :title="deployable.Name"
    :icon="deployable.Icon">
    <div class="text-text">
      <deployable-info-base :deployable="deployable"
        :tier="tier"
        :owner="owner" />
    </div>
  </cc-alert>
</template>

<script setup lang="ts">
import { Deployable } from '@/classes/components/feature/deployable/Deployable';
import DeployableInfoBase from './_deployableInfoBase.vue'

const props = withDefaults(defineProps<{
  deployable: Deployable
  tier?: number
  owner?: object | null
}>(), {
  owner: null,
})


</script>
