<template>
  <v-row justify="center">
    <v-col cols="7">
      <cc-titled-panel
        title="Custom Reserve"
        icon="cci-barrage"
        :color="`reserve--${customType.toLowerCase()}`"
      >
        <div class="text-center">
          <v-btn-toggle v-model="customType" tile mandatory group color="secondary">
            <v-btn value="Narrative">Narrative Reserve</v-btn>
            <v-divider vertical="mx-2" />
            <v-btn value="Mech">Mech Reserve</v-btn>
            <v-divider vertical="mx-2" />
            <v-btn value="Tactical">Tactical Reserve</v-btn>
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
          <v-icon left>cci-accuracy</v-icon>Add Reserve
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
    customType: 'Narrative',
    customName: '',
    details: '',
  }),
  methods: {
    add() {
      let nr = new Reserve({
        id: 'reserve_custom',
        type: this.customType,
        name: this.customName,
        label: this.customName,
        description: this.details,
        resource_name: '',
        resource_note: '',
        resource_cost: '',
        used: false,
      })
      this.clear()
      this.$emit('add', nr)
    },
    clear() {
      this.customType = 'Narrative'
      this.customName = ''
      this.details = ''
    },
  },
})
</script>