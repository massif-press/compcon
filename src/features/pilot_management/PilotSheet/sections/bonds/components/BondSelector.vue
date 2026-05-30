<template>
  <cc-compendium-browser :items="bonds"
    item-type="Bond"
    :options="options"
    view-key="sel-bond"
    equippable
    @equip="$emit('set', $event)">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Bonds</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bond } from '@/classes/pilot/components/bond/Bond'
import { CompendiumStore } from '@/stores'

const props = defineProps<{
  pilot: object
}>()

const options = ref({
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['lcp', 'none'],
      initialGroup: 'lcp',
      noSource: true,
      hideTitle: true,
    })

const bonds = computed(() => {
      if (!props.pilot.LcpConfig) return CompendiumStore().Bonds
      return CompendiumStore().Bonds.filter(
        (x: any) =>
          !x.InLcp ||
          props.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
          props.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
      )
    })
</script>
