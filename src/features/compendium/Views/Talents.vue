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
    <v-row dense align="center">
      <v-col cols="auto">
        <div class="heading h1 mt-3 mb-2">PILOT TALENTS</div>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="ctype" mandatory>
          <v-btn value="full"><v-icon>mdi-view-stream</v-icon></v-btn>
          <v-btn value="terse"><v-icon>mdi-view-list</v-icon></v-btn>
          <v-btn value="small"><v-icon>mdi-view-comfy</v-icon></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row justify="center" class="pb-3">
      <cc-talent
        v-for="t in talents"
        :id="`e_${t.ID}`"
        :key="`${t.ID}_data'`"
        :talent="t"
        :terse="ctype === 'terse'"
        :small="ctype === 'small'"
      />
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Talent } from '@/class'

@Component
export default class Talents extends Vue {
  ctype = 'full'

  private compendium = getModule(CompendiumStore, this.$store)
  get talents(): Talent[] {
    return this.compendium.Talents.filter(x => !x.IsHidden)
  }
}
</script>
