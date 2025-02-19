<template>
  <div class="text-center px-2 pt-2 pb-4">
    <v-btn-toggle
      v-model="customType"
      mandatory
      base-color="panel"
      color="primary"
      flat
      tile
      style="width: 100%">
      <v-btn size="small" height="30" width="33.33%" value="Resource">Resource</v-btn>
      <v-btn size="small" height="30" width="33.33%" value="Mech">Mech</v-btn>
      <v-btn size="small" height="30" width="33.33%" value="Tactical">Tactical</v-btn>
    </v-btn-toggle>
    <cc-text-field v-model="customName" color="primary" variant="outlined" label="Resource Name" />
    <div class="mt-4" />
    <cc-text-area v-model="details" color="primary" label="Details" />
    <cc-button
      block
      tile
      class="mt-4"
      color="primary"
      prepend-icon="cc:orbital"
      append-icon="mdi-plus"
      :disabled="!customType || !customName"
      @click="add()">
      Add Reserve
    </cc-button>
  </div>
</template>

<script lang="ts">
import { Reserve } from '@/class';

export default {
  name: 'custom-reserve-panel',
  data: () => ({
    customType: 'Resource',
    customName: '',
    details: '',
  }),
  methods: {
    add() {
      const nr = new Reserve({
        id: 'reserve_custom',
        type: this.customType,
        name: this.customName,
        label: this.customName,
        description: this.details,
        resource_name: '',
        resource_note: '',
        resource_cost: '',
        used: false,
        consumable: true,
      });
      this.clear();
      this.$emit('add', nr);
    },
    clear() {
      this.customType = 'Resources';
      this.customName = '';
      this.details = '';
    },
  },
};
</script>
