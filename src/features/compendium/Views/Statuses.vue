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
    <h1 class="heading mt-3 mb-n3">STATUSES & EFFECTS</h1>
    <v-container>
      <cc-titled-panel
        v-for="(e, i) in statuses"
        :id="`e_${e.name.replace(/\W/g, '')}`"
        :key="`${e.name.replace(/\W/g, '')}_${i}`"
        :title="e.name"
        class="my-4"
        dense
      >
        <span slot="items" class="flavor-text stark--text" v-html="e.type" />
        <v-row dense align="center" class="mt-n3">
          <v-col cols="auto" class="ml-n2">
            <v-icon v-if="e.icon" size="75" color="accent">
              cci-{{ e.type.toLowerCase() }}-{{ e.icon.toLowerCase() }}
            </v-icon>
          </v-col>
          <v-col><p v-html-safe="e.effects" class="mb-0 stark--text body-text" /></v-col>
        </v-row>
      </cc-titled-panel>
    </v-container>
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
    console.log(this.statuses)
  },
})
</script>
