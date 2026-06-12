<template>
  <cc-compendium-browser :items="bonds"
    item-type="Bond"
    :options="options"
    view-key="sel-bond"
    equippable
    @equip="$emit('set', $event)">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.pilotBonds') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed, ref } from 'vue'
import { Bond } from '@/classes/pilot/components/bond/Bond'
import { CompendiumStore } from '@/stores'

const props = defineProps<{
  pilot: Pilot
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
