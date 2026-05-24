<template>
  <cc-dialog :color="item.Color"
    :icon="item.Icon"
    :title="item.Name"
    :width="600">
    <template #activator="{ open }">
      <cc-button :color="item.Color"
        :prepend-icon="item.Icon"
        @click="open()">
        {{ item.Name }}
      </cc-button>
    </template>
    <integrated-info-base :item="item" />
  </cc-dialog>
</template>

<script setup lang="ts">
import IntegratedInfoBase from './_integratedInfoBase.vue'
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';

const props = defineProps<{
  item: MechEquipment
}>()
</script>
