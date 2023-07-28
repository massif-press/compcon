<template>
  <new-compendium-browser
    :items="weapons"
    :hidden-items="[]"
    item-type="MechWeapon"
    :table-headers="headers"
    initial-group="license"
    initial-view="list"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Mech Weapons</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';
import { CompendiumStore } from '../../store';

export default {
  name: 'Weapons',
  components: { NewCompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'SizeInt' },
      { title: 'Type', align: 'left', key: 'WeaponType' },
      { title: 'Range', align: 'left', key: 'Range' },
      { title: 'Damage', align: 'left', key: 'Damage' },
    ],
  }),
  computed: {
    weapons() {
      let items = CompendiumStore().MechWeapons;

      // TODO: profile

      // const canShowExotics =
      //   this.profile && Object.keys(this.profile).length > 0 && this.profile.GetView('showExotics');

      // if (!canShowExotics) i = i.filter((x) => !x.IsExotic);

      return items.filter((x) => !x.IsHidden);
    },
  },
};
</script>
