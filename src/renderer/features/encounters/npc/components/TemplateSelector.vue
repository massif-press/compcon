<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in templates"
      :key="`${i}_sidebar'`"
      slot="sidebar"
      link
      :disabled="!availableTemplates.some(x => x.ID === e.ID)"
      @click="
        $vuetify.goTo(`#e_${e.id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h2 ml-2">{{ e.Name }}</v-list-item-title>
    </v-list-item>
    <br />
    <div v-if="!availableTemplates.length" class="grey--text heading h2 text-center">
      // NO TEMPLATES AVAILABLE //
    </div>
    <v-row
      v-for="(e, i) in availableTemplates"
      :id="`e_${e.ID}`"
      :key="`${e.ID}_${i}`"
      dense
      no-gutters
    >
      <v-col cols="auto" class="pr-0">
        <v-btn
          block
          tile
          outlined
          min-height="calc(100% - 8px)"
          style="margin-right: -2px!important"
          class="pa-0 fadeSelect"
          color="secondary"
          @click="$emit('select', e)"
        >
          <cc-tooltip simple inline :content="`Add ${e.Name}`">
            <v-icon size="80">mdi-plus</v-icon>
          </cc-tooltip>
        </v-btn>
      </v-col>
      <v-col class="pl-0">
        <cc-titled-panel icon="cci-trait" :title="e.Name" color="primary">
          <p class="flavor-text mb-0" v-html="e.Description" />
          <v-divider class="my-2" />
          <span class="heading">
            <b class="primary--text">Base</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1">
            <v-col v-for="f in e.BaseFeatures" :key="f.ID" cols="auto">
              <cc-item-modal :item="f" />
            </v-col>
          </v-row>
          <span class="heading">
            <b class="primary--text">Optional</b>
            Features
          </span>
          <v-row dense class="mr-2 mt-n1">
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
import { NpcFeature } from '@/class'

export default Vue.extend({
  name: 'npc-freature-selector',
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
