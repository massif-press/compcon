<template>
  <cc-sidebar-view>
    <div v-for="m in Object.keys(bonuses)" :key="`list_block_${m}`" slot="sidebar" class="pt-2">
      <v-list-item>
        <v-list-item-title>
          <cc-logo :source="manufacturer(m)" />
          <span class="heading sub" :style="`color: ${manufacturer(m).Color}`">{{ m }}</span>
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-for="cb in bonuses[m]"
        :key="`${cb.ID}_data'`"
        link
        @click="
          $vuetify.goTo(`#e_${cb.ID}`, {
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
      <span class="heading mech">{{ manufacturer(m).Name }}</span>
      <cc-core-bonus-item
        v-for="(b, i) in bonuses[m]"
        :id="`e_${b.ID}`"
        :key="`${b.ID}_${i}`"
        :bonus="b"
        class="ma-3"
      />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import _ from 'lodash';


@Component
export default class CoreBonuses extends Vue {

  private compendium = getModule(CompendiumStore, this.$store)
  get bonuses() {
    return _.groupBy(this.compendium.CoreBonuses, 'Source')
  }

  public manufacturer(id: string) {
    const compendium = getModule(CompendiumStore, this.$store)
    return compendium.referenceByID('Manufacturers', id.toUpperCase())
  }

}
</script>
