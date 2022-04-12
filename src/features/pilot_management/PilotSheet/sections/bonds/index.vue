<template>
  <div class="mt-n10">
    <div class="heading h1">BOND NAME</div>
    {{ bonds }}
    <cc-tick-bar
      :key="pilot.BondController.XP"
      :current="pilot.BondController.XP"
      :max="8"
      large
      color="accent"
      @update="pilot.BondController.XP = $event"
    >
      <span class="heading h3">Pilot XP</span>
    </cc-tick-bar>
    <br />
    stress and burdens
    <v-rating :value="0" :length="8" />
    <v-text-field label="burden" />
    <br />
    bond questions
    <br />
    bond powers
    <br />
    active clocks
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'bonds-view',
  components: {},
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    bonds() {
      return getModule(CompendiumStore, this.$store).Bonds
    },
  },
})
</script>
