<template>
  <cc-sidebar-view>
    <v-list-item
      slot="sidebar"
      v-for="(t, i) in talents"
      :key="`${i}_sidebar'`"
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
    <div v-for="t in talents" :key="`${t.ID}_data'`" :id="`e_${t.ID}`">
      <cc-talent-panel :talent="t" />
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talents',
  data: () => ({
    talents: [],
  }),
  created() {
    var vm = this as any
    vm.talents = vm.$store.getters['getItemCollection']('Talents')
  },
})
</script>
