<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in templates"
      :key="`${i}_sidebar'`"
      slot="sidebar"
      link
      :disabled="!availableTemplates.some(x => x.ID === e.ID)"
      @click="
        $vuetify.goTo(`#e_${e.ID}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        })
      "
    >
      <v-list-item-title class="heading h2 ml-2">{{ e.Name }}</v-list-item-title>
    </v-list-item>
    <br />
    <div v-if="!availableTemplates.length" class="subtle--text heading h2 text-center">
      // NO TEMPLATES AVAILABLE //
    </div>
    <v-row v-for="(e, i) in availableTemplates" :id="`e_${e.ID}`" :key="`${e.ID}_${i}`">
      <v-col>
        <cc-titled-panel dense icon="cci-trait" :title="e.Name" color="primary">
          <p class="flavor-text mb-0" v-html="e.Description" />
          <v-divider class="my-2" />
          <span class="heading">
            <b class="accent--text">Base</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1">
            <v-col v-for="f in e.BaseFeatures" :key="f.ID" cols="auto">
              <cc-item-modal :item="f" small-btn />
            </v-col>
          </v-row>
          <span v-if="e.OptionalFeatures.length" class="heading">
            <b class="accent--text">Optional</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1 pb-2">
            <v-col v-for="f in e.OptionalFeatures" :key="f.ID" cols="auto">
              <cc-item-modal :item="f" small-btn />
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col cols="10">
              <v-btn block tile outlined color="secondary" @click="$emit('select', e)">
                <v-icon left>mdi-plus</v-icon>
                Assign {{ e.Name }} Template
              </v-btn>
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
import { NpcFeature } from '@/class'

export default Vue.extend({
  name: 'npc-template-selector',
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    templates: [],
  }),
  computed: {
    availableTemplates(): NpcFeature[] {
      return this.templates.filter(x => !this.npc.Templates.some(y => y.ID === x.ID))
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.templates = compendium.NpcTemplates
  },
})
</script>
