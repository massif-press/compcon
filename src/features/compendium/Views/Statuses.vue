<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in statuses"
      slot="sidebar"
      :key="`${i}_sidebar'`"
      link
      @click="
        $vuetify.goTo(`#e_${e.name.replace(/\W/g, '')}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ e.name }}</v-list-item-title>
    </v-list-item>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading mb-3 ml-5">STATUSES & EFFECTS</h1>
    <cc-titled-panel
      v-for="(e, i) in statuses"
      :id="`e_${e.name.replace(/\W/g, '')}`"
      :key="`${e.name.replace(/\W/g, '')}_${i}`"
      :title="e.name"
      class="my-2"
      dense
    >
      <div class="flavor-text mt-n2 mb-n2 text-right" v-html="e.type" />
      <v-row dense align="center">
        <v-col cols="auto" class="ml-n2">
          <v-icon size="75" color="accent">
            cci-{{ e.type.toLowerCase() }}-{{ e.icon.toLowerCase() }}
          </v-icon>
        </v-col>
        <v-col><p class="mb-0 stark--text body-text" v-html="e.effects" /></v-col>
      </v-row>
    </cc-titled-panel>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'statuses',
  data: () => ({
    statuses: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.statuses = compendium.Statuses
  },
})
</script>
