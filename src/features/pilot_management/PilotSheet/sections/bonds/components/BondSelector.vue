<template>
  <cc-compendium-browser
    :items="bonds"
    item-type="Bond"
    :options="options"
    equippable
    @equip="$emit('set', $event)"
  >
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Bonds</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
  import { Bond } from '@/class'
  import { CompendiumStore } from '@/stores'

  export default {
    name: 'BondSelector',
    props: {
      pilot: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      options: {
        views: ['single', 'table'],
        initialView: 'single',
        groups: ['lcp'],
        initialGroup: 'lcp',
        noSource: true,
        hideTitle: true,
      },
    }),
    computed: {
      bonds(): Bond[] {
        if (!this.pilot.LcpConfig) return CompendiumStore().Bonds
        return CompendiumStore().Bonds.filter(
          (x: any) =>
            !x.InLcp ||
            this.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew.LcpId) ||
            this.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew.LcpName)
        )
      },
    },
  }
</script>
