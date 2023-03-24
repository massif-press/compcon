<template>
  <v-row justify="center">
    <v-col cols="12" md="7">
      <cc-titled-panel
        title="Custom Reserve"
        :icon="`cc:reserve-${customType.toLowerCase()}`"
        :color="`reserve--${customType.toLowerCase()}`"
      >
        <div class="text-center">
          <v-btn-toggle
            v-model="customType"
            tile
            mandatory
            :group="$vuetify.display.mdAndUp"
            color="secondary"
          >
            <v-btn :small="$vuetify.display.smAndDown" value="Resource"
              >Resource</v-btn
            >
            <v-divider
              v-show="$vuetify.display.mdAndUp"
              vertical
              class="mx-2"
            />
            <v-btn :small="$vuetify.display.smAndDown" value="Mech">Mech</v-btn>
            <v-divider
              v-show="$vuetify.display.mdAndUp"
              vertical
              class="mx-2"
            />
            <v-btn :small="$vuetify.display.smAndDown" value="Tactical"
              >Tactical</v-btn
            >
          </v-btn-toggle>
        </div>
        <div class="mx-4 my-2">
          <v-text-field
            v-model="customName"
            variant="outlined"
            label="Resource Name"
            hide-details
          />
          <v-textarea
            v-model="details"
            auto-grow
            rows="2"
            label="Details"
            filled
            hide-details
            class="my-3"
          />
        </div>
        <v-btn
          block
          tile
          large
          class="my-3"
          color="primary"
          :disabled="!customType || !customName"
          @click="add()"
        >
          <v-icon start>cc:accuracy</v-icon>
          Add Reserve
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
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
