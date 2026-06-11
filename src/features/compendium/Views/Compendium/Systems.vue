<template>
  <cc-compendium-browser :items="systems"
    item-type="MechSystem"
    :table-headers="headers"
    :options="options"
    :manufacturers="manufacturers"
    view-key="cb-systems">
    <template #header>
      <div class="heading h3 text-center text-accent">{{ $t('compendium.categories.mechSystems') }}</div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderBy } from 'lodash-es';
import { CompendiumStore, UserStore } from '@/stores';
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment'

const options = ref({
      views: ['single', 'table'],
      initialView: 'single',
      groups: ['source', 'lcp', 'license', 'none'],
      initialGroup: 'license',
      showExotics: UserStore().User.Option('showExotics') as boolean,
    })
const headers = ref([
      { title: '', align: 'left', key: 'Source' },
      { title: 'System', align: 'left', key: 'Name' },
      { title: 'License', key: 'License' },
      { title: 'License Level', align: 'center', key: 'LicenseLevel' },
      { title: 'Tags', align: 'center', key: 'Tags' },
      { title: 'SP Cost', align: 'center', key: 'SP' },
    ])

const manufacturers = computed(() => {
      return CompendiumStore().Manufacturers;
    })
const systems = computed(() => {
      return orderBy(
        [...CompendiumStore().MechSystems, ...CompendiumStore().WeaponMods].filter(
          (x) => !x.IsHidden
        ),
        'Name'
      );
    })
</script>
