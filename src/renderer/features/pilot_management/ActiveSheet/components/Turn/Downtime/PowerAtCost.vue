<template>
  <div>
    <v-card-text>
      <v-layout wrap class="text-center">
        <v-flex xs12 class="effect-text">
          <p class="pt-2 pb-0 ma-0">
            Name what you want. You can
            <strong>always</strong>
            get it, but the GM chooses
            <strong>one or two</strong>
            complications, depending on how outlandish the request is
          </p>
        </v-flex>
        <v-divider class="ma-2" />
        <v-flex xs12>
          <span class="minor-title">Resource Gained</span>
          <reserve-selector ref="rs" />
        </v-flex>
        <v-flex xs6>
          <div class="ml-2 mr-2">
            <span class="minor-title">Complication</span>
            <v-select
              label="Complication"
              v-model="complication1"
              :items="complications"
              outline
              hide-details
            />
          </div>
        </v-flex>
        <v-flex xs6>
          <div class="ml-2 mr-2">
            <span class="minor-title">Additional Complication</span>
            <v-select
              label="Complication"
              v-model="complication2"
              :items="complications"
              outline
              hide-details
            />
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        color="primary"
        @click="addReserve"
        :disabled="complication1 === 'None' || !$refs.rs.reserveComplete"
      >
        add reserve
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ReserveSelector from './ReserveSelector.vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'power-at-cost',
  components: { ReserveSelector },
  props: {
    pilot: Object,
  },
  data: () => ({
    complication1: 'None',
    complication2: 'None',
    complications: [
      'None',
      'It’s going to take a lot more time than you anticipated',
      'It’s going to be really damn risky',
      'You have to have to give something up or leave something behind (wealth, resources, allies)',
      'You’re going to piss someone or something important and powerful off',
      'It’s going to involve going wildly off the plan',
      'You’ll need more information to proceed safely',
      'What you put together is going to fall apart damn soon',
      'You’ll need to gather more resources first (you know where to find them, however)',
      'You can’t exactly get what you want, just approximately what you want, a lesser version, or less of what you want',
    ],
  }),
  methods: {
    addReserve() {
      const rs = this.$refs.rs
      const r = rs.reserveByID(rs.reserve)
      let nr = new Reserve({
        id: rs.reserve || 'reserve_custom',
        type: rs.type,
        name: (r && r.name) || rs.custom_name || 'Custom Reserve',
        label: rs.custom_name,
        description: (r && r.description) || '',
        roll_min: 0,
        roll_max: 0,
      })
      nr.ResourceName = rs.custom_name
      nr.Note = rs.details
      nr.ResourceCost = this.complication1
      if (this.complication2 !== 'None') nr.ResourceCost += `\n${this.complication2}`
      this.pilot.Reserves.push(nr)
      this.close()
    },
    close() {
      this.complication1 = 'None'
      this.complication2 = 'None'
      this.$refs.rs.reset()
      this.$emit('close')
    },
  },
})
</script>
