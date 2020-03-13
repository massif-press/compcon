<template>
  <div>
    <v-card-text>
      <p
        class="text-center flavor-text"
        v-html="
          'Name what you want. You can <strong>always</strong> get it, but the GM chooses <strong>one or two</strong> complications, depending on how outlandish the request is'
        "
      />

      <v-divider class="mb-2" />
      <v-row class="mx-3">
        <v-col cols="6">
          <span class="heading h3 accent--text">Resource Gained</span>
          <reserve-selector ref="rs" />
        </v-col>
        <v-col cols="6">
          <span class="heading h3 accent--text">Complication</span>
          <v-select
            v-model="complication1"
            label="Complication"
            :items="complications"
            outlined
            dense
            hide-details
          />
          <br />
          <span class="heading h3 accent--text">Additional Complication</span>
          <v-select
            v-model="complication2"
            label="Complication"
            :items="complications"
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        color="primary"
        :disabled="complication1 === 'None' || !$refs.rs.reserveComplete"
        @click="addReserve"
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
    pilot: { type: Object, required: true },
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
      const nr = new Reserve({
        id: rs.reserve || 'reserve_custom',
        type: rs.type,
        name: (r && r.name) || rs.custom_name || 'Custom Reserve',
        label: rs.custom_name,
        description: (r && r.description) || '',
        resource_name: rs.custom_name || '',
        resource_note: rs.details || '',
        resource_cost: this.complication1,
        used: false,
      })
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
