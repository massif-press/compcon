<template>
  <cc-compendium-browser :items="gear"
    item-type="PilotGear"
    :multi-headers="headers"
    :options="options"
    view-key="cb-pilot-gear">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('common.pilotGear') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore, UserStore } from '@/stores';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const headers = ref({
      PilotArmor: [
        { title: t('compendium.titles.contentPack'), key: 'LcpName' },
        { title: t('common.type'), key: 'Type' },
        { title: t('common.item'), key: 'Name' },
        { title: t('stats.armor'), key: 'ArmorString' },
        { title: t('common.hpBonus'), key: 'HpString' },
        { title: t('compendium.titles.eDefense'), key: 'EdefString' },
        { title: t('stats.evasion'), key: 'EvasionString' },
        { title: t('stats.speed'), key: 'SpeedString' },
        { title: t('compendium.titles.tags'), align: 'center', key: 'Tags' },
      ],
      PilotWeapon: [
        { title: t('compendium.titles.contentPack'), key: 'LcpName' },
        { title: t('common.type'), key: 'Type' },
        { title: t('common.item'), key: 'Name' },
        { title: t('compendium.titles.range'), key: 'Range' },
        { title: t('compendium.titles.damage'), key: 'Damage' },
        { title: t('compendium.titles.tags'), align: 'center', key: 'Tags' },
      ],
      PilotGear: [
        { title: t('compendium.titles.contentPack'), key: 'LcpName' },
        { title: t('common.type'), key: 'Type' },
        { title: t('common.item'), key: 'Name' },
        { title: t('compendium.titles.uses'), key: 'MaxUses' },
        { title: t('compendium.titles.tags'), align: 'center', key: 'Tags' },
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
