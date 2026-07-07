<template>
  <cc-compendium-browser :items="weapons"
    item-type="MechWeapon"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-weapons">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.mechWeapons') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore } from '../../store';
import { UserStore } from '@/stores';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const options = ref({
      views: ['single', 'table', 'cards', 'scatter', 'bar', 'compare'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license', 'none'],
      initialGroup: 'license',
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })
const headers = ref([
      { title: '', align: 'left', key: 'Source' },
      { title: t('compendium.titles.weapon'), align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: t('compendium.titles.size'), align: 'left', key: 'Size' },
      {
        title: t('compendium.titles.type'),
        align: 'left',
        key: 'WeaponTypes',
        sortRaw(a, b) {
          const typeA = a.WeaponTypes.join(',');
          const typeB = b.WeaponTypes.join(',');
          if (typeA < typeB) return -1;
          if (typeA > typeB) return 1;
          return 0;
        },
      },
      { title: t('compendium.titles.tags'), align: 'center', key: 'Tags' },
      {
        title: t('compendium.titles.range'),
        align: 'left',
        key: 'Range',
        sortRaw(a, b) {
          return a.SelectedProfile.RangeSum() - b.SelectedProfile.RangeSum();
        },
      },
      {
        title: t('compendium.titles.damage'),
        align: 'left',
        key: 'Damage',
        sortRaw(a, b) {
          return a.MaxDamage - b.MaxDamage;
        },
      },
    ])

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const weapons = computed(() => {
      const items = CompendiumStore().MechWeapons;

      return orderBy(
        items.filter((x) => !x.IsHidden),
        'Name'
      );
    })
</script>
