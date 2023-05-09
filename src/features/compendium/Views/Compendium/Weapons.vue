<template>
  <compendium-browser :headers="headers" items="Mech Weapons" />
</template>

<script lang="ts">
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

export default {
  name: 'Weapons',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', align: 'left', value: 'Source' },
      { title: 'Weapon', align: 'left', value: 'Name' },
      { title: 'License', align: 'left', value: 'LicenseString' },
      { title: 'Size', align: 'left', value: 'SizeInt' },
      { title: 'Type', align: 'left', value: 'WeaponType' },
      { title: 'Range', align: 'left', value: 'Range[0].Max' },
      { title: 'Damage', align: 'left', value: 'Damage[0].Max' },
    ],
  }),
};
</script>
