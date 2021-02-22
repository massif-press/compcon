<template>
  <v-row justify="center">
    <v-col cols="12" md="7">
      <cc-titled-panel
        title="Custom Reserve"
        :icon="`cci-reserve-${customType.toLowerCase()}`"
        :color="`reserve--${customType.toLowerCase()}`"
      >
        <div class="text-center">
          <v-btn-toggle
            v-model="customType"
            tile
            mandatory
            :group="$vuetify.breakpoint.mdAndUp"
            color="secondary"
          >
            <v-btn :small="$vuetify.breakpoint.smAndDown" value="Resource">
              Resource
            </v-btn>
            <v-divider v-show="$vuetify.breakpoint.mdAndUp" vertical class="mx-2" />
            <v-btn :small="$vuetify.breakpoint.smAndDown" value="Mech">Mech</v-btn>
            <v-divider v-show="$vuetify.breakpoint.mdAndUp" vertical class="mx-2" />
            <v-btn :small="$vuetify.breakpoint.smAndDown" value="Tactical">
              Tactical
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="mx-4 my-2">
          <v-text-field v-model="customName" outlined label="Resource Name" hide-details />
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
          <v-icon left>cci-accuracy</v-icon>
          Add Reserve
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'

export default Vue.extend({
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
      })
      this.clear()
      this.$emit('add', nr)
    },
    clear() {
      this.customType = 'Resources'
      this.customName = ''
      this.details = ''
    },
  },
})
</script>
