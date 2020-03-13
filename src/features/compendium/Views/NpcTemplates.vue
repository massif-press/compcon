<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in templates"
      :key="`${i}_sidebar'`"
      slot="sidebar"
      link
      @click="
        $vuetify.goTo(`#e_${e.ID}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h2 ml-2">{{ e.Name }}</v-list-item-title>
    </v-list-item>
    <div v-if="!templates.length" class="subtle--text heading h2 text-center">
      // NO TEMPLATES AVAILABLE //
    </div>
    <v-row v-for="(e, i) in templates" :id="`e_${e.ID}`" :key="`${e.ID}_${i}`">
      <v-col class="pl-0">
        <cc-titled-panel dense icon="cci-trait" :title="e.Name" color="primary">
          <p class="flavor-text mb-0" v-html="e.Description" />
          <v-divider class="my-2" />
          <span class="heading">
            <b class="accent--text">Base</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1">
            <v-col v-for="f in e.BaseFeatures" :key="f.ID" cols="auto">
              <cc-item-modal :item="f" />
            </v-col>
          </v-row>
          <span v-if="e.OptionalFeatures.length" class="heading">
            <b class="accent--text">Optional</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1 pb-2">
            <v-col v-for="f in e.OptionalFeatures" :key="f.ID" cols="auto">
              <cc-item-modal :item="f" />
            </v-col>
          </v-row>
        </cc-titled-panel>
      </v-col>
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'npc-templates',
  data: () => ({
    templates: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.templates = compendium.NpcTemplates
  },
})
</script>
