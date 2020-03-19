<template>
  <v-menu v-model="menu" offset-x left :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn small outlined :disabled="!chargables.length" v-on="on">
        <v-icon left>mdi-dice-6</v-icon>
        Recharge
      </v-btn>
    </template>
    <v-card>
      <v-card-text class="text-center text--text">
        <div class="body-text">
          At the start of this NPC's turn,
          <v-btn small text color="primary" @click="rollDie">roll 1d6</v-btn>
          to determine which features are recharged
        </div>
        <v-btn
          v-for="n in 6"
          :key="`rb${n}`"
          class="mt-0 mb-4"
          :ripple="false"
          x-large
          :color="roll && roll !== n ? 'panel' : 'primary'"
          icon
          @click="roll = n"
        >
          <v-icon class="die-hover" size="55px" v-html="`mdi-dice-${n}`" />
        </v-btn>
        <div v-if="recharged.length" class="light-panel body-text">
          The following features will be recharged:
          <div v-for="r in recharged" :key="r.ID" class="heading h3">
            {{ r.Name }} ({{ r.ChargeRoll }}+)
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn tile color="primary" @click="commit">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { NpcItem } from '@/class'
export default Vue.extend({
  name: 'recharge-menu',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    menu: false,
    roll: 0,
  }),
  computed: {
    chargables() {
      return this.npc.Items.filter((x: NpcItem) => x.IsChargable && !x.IsCharged)
    },
    recharged() {
      if (!this.roll) return []
      return this.chargables.filter((x: NpcItem) => x.ChargeRoll <= this.roll)
    },
  },
  methods: {
    rollDie() {
      this.roll = Math.floor(Math.random() * 6) + 1
    },
    commit() {
      this.recharged.forEach((e: NpcItem) => {
        e.IsCharged = true
      })
      this.roll = 0
      this.menu = false
    },
  },
})
</script>
