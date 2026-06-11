<template>
  <cc-compendium-browser :items="gear"
    item-type="PilotGear"
    :multi-headers="headers"
    :options="options"
    view-key="cb-pilot-gear">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.pilotGear') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore, UserStore } from '@/stores';

const headers = ref({
      PilotArmor: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Armor', key: 'ArmorString' },
        { title: 'HP Bonus', key: 'HpString' },
        { title: 'E-Defense', key: 'EdefString' },
        { title: 'Evasion', key: 'EvasionString' },
        { title: 'Speed', key: 'SpeedString' },
        { title: 'Tags', align: 'center', key: 'Tags' },
      ],
      PilotWeapon: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Range', key: 'Range' },
        { title: 'Damage', key: 'Damage' },
        { title: 'Tags', align: 'center', key: 'Tags' },
      ],
      PilotGear: [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Type', key: 'Type' },
        { title: 'Item', key: 'Name' },
        { title: 'Uses', key: 'MaxUses' },
        { title: 'Tags', align: 'center', key: 'Tags' },
      ],
    })
const options = ref({
      views: ['single', 'list', 'table', 'cards'],
      initialView: 'list',
      groups: ['lcp', 'type', 'none'],
      initialGroup: 'type',
      noSource: true,
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })

const gear = computed(() => {
      return orderBy(
        CompendiumStore().PilotGear.filter((x: any) => !x.IsHidden),
        'Name'
      );
    })
</script>
