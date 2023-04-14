<template>
  <compendium-browser :headers="headers" items="Frames" />
</template>

<script lang="ts">
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

export default {
  name: 'Frames',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
      { title: 'Size', key: 'Size' },
      { title: 'Armor', key: 'Armor' },
      { title: 'HP', key: 'HP' },
      { title: 'Evasion', key: 'Evasion' },
      { title: 'EDef', key: 'EDefense' },
      { title: 'HeatCap', key: 'HeatCap' },
      { title: 'RepCap', key: 'RepCap' },
      { title: 'Sensors', key: 'SensorRange' },
      { title: 'TechAtk', key: 'TechAttack' },
      { title: 'Save', key: 'SaveTarget' },
      { title: 'Speed', key: 'Speed' },
      { title: 'SP', key: 'SP' },
    ],
  }),
};
</script>
