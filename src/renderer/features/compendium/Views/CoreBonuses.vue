<template>
  <cc-sidebar-view>
    <div v-for="m in Object.keys(bonuses)" :key="`list_block_${m}`" slot="sidebar" class="pt-2">
      <v-list-item>
        <v-list-item-title>
          <cc-logo :source="m" />
          <span class="heading sub" :style="`color: ${manufacturer(m).color}`">{{ m }}</span>
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="cb in bonuses[m]"
        :key="`${cb.id}_data'`"
        link
        @click="
          $vuetify.goTo(`#e_${cb.id}`, {
            duration: 150,
            easing: 'easeInOutQuad',
            offset: 25,
          })
        "
      >
        <v-list-item-title class="heading h3 ml-2">{{ cb.Name }}</v-list-item-title>
      </v-list-item>
    </div>
    <h1 class="heading mb-3">CORE BONUSES</h1>
    <div v-for="m in Object.keys(bonuses)" :key="`summary_block_m${m}`">
      <span class="heading mech">{{ manufacturer(m).name }}</span>
      <cc-core-bonus-item
        v-for="(b, i) in bonuses[m]"
        :id="`e_${b.id}`"
        :key="`${b.ID}_${i}`"
        :bonus="b"
        class="ma-3"
      />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'core-bonuses',
  data: () => ({
    bonuses: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.bonuses = this.$_.groupBy(compendium.CoreBonuses, 'source')
  },
  methods: {
    manufacturer(id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID(id.toUpperCase())
    },
  },
})
</script>
