<template>
  <v-flex>
    <span class="text-uppercase">{{ title }}</span>
    <span class="grey--text">({{ attr || 0 }})</span>
    <v-tooltip top>
      <v-rating
        slot="activator"
        v-model="attr"
        hover
        x-large
        length="6"
        readonly
        dense
        empty-icon="mdi-hexagon-outline"
        full-icon="mdi-hexagon-slice-6"
      />
      <span class="effect-text" v-html="tooltip()" />
    </v-tooltip>
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'hase-pips',
    props: {
      title: String,
      attribute: String,
    },
    computed: {
      attr(): number {
        return this.$store.getters['getPilot'].mechSkills[this.attribute]
      },
    },
    methods: {
      tooltip(): string {
        switch (this.title) {
          case 'hull':
            return `MECH HP <b>+${this.attr *
              2}</b><br>REPAIR CAPACITY <b>+${Math.floor(this.attr / 2)}</b>`
          case 'agility':
            return `EVASION <b>+${this.attr}</b><br>SPEED<b>+${Math.floor(
              this.attr / 2
            )}</b>`
          case 'systems':
            return `E-DEFENSE <b>+${this.attr}</b><br>TECH ATTACK <b>+${
              this.attr
            }</b><br>SP <b>+${Math.floor(this.attr / 2)}</b>`
          case 'engineering':
            return `HEAT CAPACITY <b>+${
              this.attr
            }</b><br>LIMITED SYSTEMS BONUS <b>+${Math.floor(this.attr / 2)}</b>`
          default:
            return ''
        }
      },
    },
  })
</script>
