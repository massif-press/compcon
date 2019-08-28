<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in glossary"
      slot="sidebar"
      :key="`${i}_sidebar'`"
      link
      @click="
        $vuetify.goTo(`#e_${e.name}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ e.name }}</v-list-item-title>
    </v-list-item>

    <h1 class="heading mb-3 ml-5">GLOSSARY</h1>
    <div v-for="e in glossary" :id="`e_${e.name}`" :key="e.name">
      <h3 class="heading primary--text">{{ e.name }}</h3>
      <p class="body-text ml-2">{{ e.description }}</p>
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { glossary } from 'lancer-data'

export default Vue.extend({
  name: 'glossary',
  data: () => ({
    glossary: [],
  }),
  created() {
    this.glossary = this.$_.sortBy(glossary, [x => x.name])
  },
})
</script>
