<template>
  <cc-sidebar-view>
    <div v-for="m in Object.keys(bonuses)" :key="`list_block_${m}`" slot="sidebar">
      <v-list-item>
        <v-list-item-title class="ml-n5 mb-n2">
          <cc-logo :source="manufacturer(m)" style="margin-bottom: -6px" />
          <span
            class="heading sub"
            :style="`color: ${manufacturer(m).GetColor($vuetify.theme.dark)}`"
          >
            {{ m }}
          </span>
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
        <v-list-item-title class="heading h3 text--text">{{ cb.Name }}</v-list-item-title>
      </v-list-item>
    </div>
    <h1 class="heading mt-3 mb-n8">CORE BONUSES</h1>
    <div v-for="m in Object.keys(bonuses)" :key="`summary_block_m${m}`">
      <div class="mb-n5 mt-4">
        <cc-logo
          :size="$vuetify.breakpoint.mdAndUp ? 'xLarge' : 'medium'"
          :source="manufacturer(m)"
          class="mb-n2"
        />
        <span
          class="heading mech"
          :style="`color: ${manufacturer(m).GetColor($vuetify.theme.dark)}`"
        >
          {{ manufacturer(m).Name }}
        </span>
      </div>
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
