<template>
  <div>
    <v-select
      v-model="type"
      label="Reserve Type"
      :items="reserveTypes"
      outlined
      dense
      hide-details
      @change="reserve = ''"
    />
    <v-select
      v-if="type && type !== 'Custom'"
      v-model="reserve"
      class="ma-2"
      label="Reserve"
      :items="reserves"
      item-text="name"
      item-value="id"
      outlined
      dense
      hide-details
    />
    <v-slide-y-transition>
      <v-card v-if="type === 'Custom' || reserve" color="light-panel" class="mx-3 mt-1">
        <v-card-text class="flavor-text pt-1 pb-0">
          <p
            v-if="type !== 'Custom' && reserve"
            class="pa-1 ma-1"
            v-html="reserveByID(reserve).description"
          />
          <div
            v-if="
              type !== 'Mech' &&
                reserve !== 'reserve_extendedharness' &&
                reserve !== 'reserve_bombardment'
            "
          >
            <v-text-field
              v-model="custom_name"
              color="accent"
              label="Resource Name"
              style="width: 500px"
            />
            <v-textarea v-model="details" color="accent" auto-grow rows="1" label="Details" box />
          </div>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { reserves } from 'lancer-data'

export default Vue.extend({
  name: 'reserve-selector',
  data: () => ({
    type: '',
    reserve: '',
    custom_name: '',
    details: '',
    reserveTypes: ['Resources', 'Tactical', 'Mech', 'Custom'],
  }),
  computed: {
    reserveComplete() {
      return (
        (this.type && this.reserve) || (this.type === 'Custom' && this.custom_name && this.details)
      )
    },
    reserves() {
      return reserves.filter(x => x.type === this.type)
    },
  },
  methods: {
    reserveByID(id) {
      return reserves.find(x => x.id === id)
    },
    reset() {
      this.type = ''
      this.reserve = ''
      this.custom_name = ''
      this.details = ''
    },
  },
})
</script>
