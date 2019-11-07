<template>
  <cc-titled-panel
    icon="cci-corebonus"
    :title="bonus.Name"
    :color="manufacturer(bonus.Source).color"
  >
    <p class="flavor-text" v-html="bonus.Description" />
    <p class="effect-text pb-0" v-html="bonus.Effect" />
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
  methods: {
    manufacturer(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID('Manufacturers', id.toUpperCase())
    },
  },
})
</script>