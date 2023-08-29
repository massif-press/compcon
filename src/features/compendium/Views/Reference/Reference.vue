<template>
  <v-container>
    <h1 class="heading h1 ml-5">Quick Reference</h1>
    <v-tabs v-model="tab" fixed-tabs color="primary">
      <v-tab value="0">Action Economy</v-tab>
      <v-tab value="1">Damage Tables</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item>
        <action-economy />
      </v-window-item>
      <v-window-item>
        <damage-tables />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import ActionEconomy from './qr_pages/ActionEconomy.vue';
import DamageTables from './qr_pages/DamageTables.vue';

export default {
  name: 'reference',
  components: {
    ActionEconomy,
    DamageTables,
  },
  data: () => ({
    tab: '0',
  }),
};
</script>
