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
      <cc-bond-info
        v-for="(e, i) in bonds"
        :id="`e_${e.Name.replace(/\W/g, '')}`"
        :key="`${e.Name.replace(/\W/g, '')}_${i}`"
        :bond="e"
        class="my-4"
      />
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
