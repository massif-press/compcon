<template>
  <cc-compendium-browser :items="bonuses"
    :itemType="'CoreBonus'"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-core-bonuses">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('pm.level.coreBonuses') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore, UserStore } from '@/stores';
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const headers = ref([
      { title: t('compendium.titles.contentPack'), key: 'LcpName' },
      { title: t('compendium.titles.manufacturer'), key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: t('compendium.titles.effect'), key: 'Effect' },
    ])
const options = ref({
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['source', 'lcp', 'none'],
      initialGroup: 'source',
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const bonuses = computed(() => {
      return orderBy(
        CompendiumStore().CoreBonuses.filter((x: CoreBonus) => !x.IsHidden),
        'Manufacturer'
      );
    })
</script>
