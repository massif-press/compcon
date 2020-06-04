<template>
  <cc-sidebar-view>
    <div v-for="m in Object.keys(bonuses)" :key="`list_block_${m}`" slot="sidebar">
      <v-list-item>
        <v-list-item-title>
          <cc-logo :source="manufacturer(m)" class="mb-n1" />
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
        <v-list-item-title class="heading h3">{{ cb.Name }}</v-list-item-title>
      </v-list-item>
    </div>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading mb-3">CORE BONUSES</h1>
    <div v-for="m in Object.keys(bonuses)" :key="`summary_block_m${m}`">
      <cc-logo
        :size="$vuetify.breakpoint.mdAndUp ? 'xLarge' : 'medium'"
        :source="manufacturer(m)"
        class="mb-n2"
      />
      <span
        v-resize-text="{ maxFontSize: '36pt' }"
        class="heading mech"
        :style="`color: ${manufacturer(m).Color}`"
      >
        {{ manufacturer(m).Name }}
      </span>
      <cc-core-bonus-item
        v-for="(b, i) in bonuses[m]"
        :id="`e_${b.ID}`"
        :key="`${b.ID}_${i}`"
        :bonus="b"
        class="mx-3 my-5"
      />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import _ from 'lodash'

@Component
export default class CoreBonuses extends Vue {
  private compendium = getModule(CompendiumStore, this.$store)
  get bonuses() {
    return _.groupBy(this.compendium.CoreBonuses, 'Source')
  }

  public manufacturer(id: string) {
    const compendium = getModule(CompendiumStore, this.$store)
    return compendium.Manufacturers.find(x => x.ID === id.toUpperCase())
  }
}
</script>
