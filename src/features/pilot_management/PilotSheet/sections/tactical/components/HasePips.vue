<template>
  <v-col class="py-0">
    <span class="text-uppercase stat-text">{{ title }}</span>
    <span class="flavor-text subtle--text">({{ skillPoints || 0 }})</span>
    <cc-tooltip simple :content="tooltip()">
      <cc-rating :model="skillPoints" :max="6" dense color="secondary" />
    </cc-tooltip>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'hase-pips',
  props: {
    title: {
      type: String,
      required: true,
    },
    skillPoints: {
      type: Number,
      required: true,
    },
  },
  methods: {
    //TODO: move into rules util class
    tooltip(): string {
      switch (this.title) {
        case 'hull':
          return `MECH HP <b>+${this.skillPoints * 2}</b><br>REPAIR CAPACITY <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`
        case 'agility':
          return `EVASION <b>+${this.skillPoints}</b><br>SPEED <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`
        case 'systems':
          return `E-DEFENSE <b>+${this.skillPoints}</b><br>TECH ATTACK <b>+${
            this.skillPoints
          }</b><br>SP <b>+${Math.floor(this.skillPoints / 2)}</b>`
        case 'engineering':
          return `HEAT CAPACITY <b>+${
            this.skillPoints
          }</b><br>LIMITED SYSTEMS BONUS <b>+${Math.floor(this.skillPoints / 2)}</b>`
        default:
          return ''
      }
    },
  },
})
</script>
