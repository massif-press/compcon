<template>
  <cc-compendium-browser :items="bonuses"
    :itemType="'CoreBonus'"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-core-bonuses">
    <template #header>
      <div class="heading h3 text-center text-accent">Core Bonuses</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore, UserStore } from '@/stores';
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'

const headers = ref([
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Manufacturer', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Effect', key: 'Effect' },
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
