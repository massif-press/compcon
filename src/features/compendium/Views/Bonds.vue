<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in bonds"
      slot="sidebar"
      :key="`${i}_sidebar'`"
      link
      @click="
        $vuetify.goTo(`#e_${e.Name.replace(/\W/g, '')}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ e.Name }}</v-list-item-title>
    </v-list-item>
    <h1 class="heading mt-3 mb-n3">Pilot Bonds</h1>
    <v-container>
      <cc-titled-panel
        v-for="(e, i) in bonds"
        :id="`e_${e.Name.replace(/\W/g, '')}`"
        :key="`${e.Name.replace(/\W/g, '')}_${i}`"
        :title="e.Name"
        class="my-4"
        dense
      >
        <span slot="items" class="flavor-text white--text" v-html="e.LcpName" />
        <v-row class="text--text">
          <v-col>
            <div class="overline mb-n1 font-weight-bold">MAJOR IDEALS</div>
            <ul>
              <li v-for="(s, i) in e.MajorIdeals" :key="`mi_${e.ID}_${i}`" v-text="s" />
            </ul>
          </v-col>
          <v-col>
            <div class="overline mb-n1 font-weight-bold">MINOR IDEALS</div>
            <ul>
              <li v-for="(s, i) in e.MinorIdeals" :key="`mmi_${e.ID}_${i}`" v-text="s" />
            </ul>
          </v-col>
        </v-row>
        <v-row class="text--text">
          <v-col v-for="(q, i) in e.Questions" :key="`1_${e.ID}_${i}`">
            <div class="overline mb-n1 font-weight-bold" v-text="q.question" />
            <ul>
              <li v-for="(o, j) in q.options" :key="`qo_${e.ID}_${i}_${j}`" v-text="o" />
            </ul>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div class="heading h3 my-3">BOND POWERS</div>
        <v-row class="mb-3">
          <v-col xl="6" sm="12" v-for="(p, i) in e.Powers" :key="`p_${e.ID}_${i}}`">
            <v-card outlined class="pa-2" style="background-color: var(--v-background-darken-2)">
              <div
                v-if="p.veteran"
                class="heading h4 accent--text"
                v-text="`${p.name} (Veteran Power)`"
              />
              <div
                v-else-if="p.master"
                class="heading h4 exotic--text"
                v-text="`${p.name} (Master Power`"
              />
              <div v-else class="heading h4" v-text="p.name" />
              <div v-if="p.prerequisite" class="caption pa-2 text--disabled">
                <i v-text="p.prerequisite" />
              </div>
              <div class="px-2" v-html-safe="p.description" />
            </v-card>
          </v-col>
        </v-row>
      </cc-titled-panel>
    </v-container>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'bonds',
  components: { SidebarArrayView },
  data: () => ({
    bonds: [],
  }),
  created() {
    this.bonds = getModule(CompendiumStore, this.$store).Bonds
  },
})
</script>
