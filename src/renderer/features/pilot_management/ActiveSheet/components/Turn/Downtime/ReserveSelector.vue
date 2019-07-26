<template>
  <v-card flat class="ma-2">
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs6>
          <v-select
            class="ml-2 mr-2"
            label="Reserve Type"
            v-model="type"
            :items="reserveTypes"
            outline
            hide-details
            @change="reserve = ''"
          />
        </v-flex>
        <v-flex xs6 v-if="type && type !== 'Custom'">
          <v-select
            class="ml-2 mr-2"
            label="Reserve"
            v-model="reserve"
            :items="reserves"
            item-text="name"
            item-value="id"
            outline
            hide-details
          />
        </v-flex>
        <v-slide-y-transition>
          <v-flex xs12 v-show="(type === 'Custom' || reserve)">
            <v-card color="grey lighten-4" class="ml-3 mr-3">
              <v-card-text class="pt-1 pb-0">
                <p
                  v-if="type !== 'Custom' && reserve"
                  class="pa-1 ma-1"
                  v-html="reserveByID(reserve).description"
                />
                <div
                  v-if="type !== 'Mech' && reserve !== 'reserve_extendedharness' && reserve !== 'reserve_bombardment'"
                >
                  <v-text-field v-model="custom_name" label="Resource Name" style="width: 500px" />
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" box />
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-slide-y-transition>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { reserves } from 'lancer-data'

export default Vue.extend({
  name: 'reserve-selector',
  data: () => ({
    type: '',
    reserve: '',
    custom_name: '',
    details: '',
    reserveTypes: ['Narrative', 'Tactical', 'Mech', 'Custom'],
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
  },
})
</script>

