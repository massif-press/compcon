<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(t, i) in talents"
      :key="`${i}_sidebar'`"
      slot="sidebar"
      link
      @click="
        $vuetify.goTo(`#e_${t.ID}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ t.Name }}</v-list-item-title>
    </v-list-item>
    <h1 class="heading mb-3 ml-5">PILOT TALENTS</h1>
    <div v-for="t in talents" :id="`e_${t.ID}`" :key="`${t.ID}_data'`">
      <cc-talent-panel :talent="t" />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'


@Component
export default class Talents extends Vue {

  private compendium = getModule(CompendiumStore, this.$store)
  get talents() {
    return this.compendium.Talents
  }
}
</script>
