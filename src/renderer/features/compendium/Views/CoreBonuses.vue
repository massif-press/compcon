<template>
  <cc-sidebar-view>
    <div slot="sidebar" v-for="m in Object.keys(bonuses)" :key="`list_block_${m}`" class="pt-2">
      <v-list-item>
        <v-list-item-title>
          <v-icon left>cci-orbital</v-icon>
          <span class="heading sub">{{ m }}</span>
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
      <cc-titled-panel
        :id="`e_${b.id}`"
        v-for="(b, i) in bonuses[m]"
        :key="`${b.ID}_${i}`"
        icon="cci-corebonus"
        :title="b.Name"
        color="panel-border"
        class="ma-3"
      >
        <p class="flavor-text" v-html="b.Description" />
        <p class="effect-text pb-0" v-html="b.Effect" />
      </cc-titled-panel>
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { CoreBonus } from '@/class'

export default Vue.extend({
  name: 'core-bonuses',
  data: () => ({
    bonuses: [],
  }),
  methods: {
    manufacturer(id: string) {
      return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
    },
  },
  created() {
    var vm = this as any
    vm.bonuses = this.$_.groupBy(vm.$store.getters.getItemCollection('CoreBonuses'), 'source')
  },
})
</script>
