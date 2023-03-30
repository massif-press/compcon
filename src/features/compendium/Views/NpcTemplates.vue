<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in templates"
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
      <v-list-item-title class="heading h2 ml-2">{{
        e.Name
      }}</v-list-item-title>
    </v-list-item>
    <div v-if="!templates.length" class="text-subtle heading h2 text-center">
      // NO TEMPLATES AVAILABLE //
    </div>
    <v-row v-for="(e, i) in templates" :id="`e_${e.ID}`">
      <v-col class="pl-0">
        <cc-titled-panel
          density="compact"
          icon="cc:trait"
          :title="e.Name"
          color="primary"
        >
          <div v-if="e.InLcp" class="heading h3 text-text">
            {{ e.LcpName }}
          </div>
          <p v-html-safe="e.Description" class="flavor-text mb-0" />
          <v-divider class="my-2" />
          <span class="heading">
            <b class="text-accent">Base</b>
            Features
          </span>
          <v-row density="compact" class="mr-2 mt-n1">
            <v-col v-for="f in e.BaseFeatures">
              <cc-item-modal :item="f" />
            </v-col>
          </v-row>
          <span v-if="e.OptionalFeatures.length" class="heading">
            <b class="text-accent">Optional</b>
            Features
          </span>
          <v-row density="compact" class="mr-2 mt-n1 pb-2">
            <v-col v-for="f in e.OptionalFeatures">
              <cc-item-modal :item="f" />
            </v-col>
          </v-row>
        </cc-titled-panel>
      </v-col>
    </v-row>
  </cc-sidebar-view>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'npc-templates',
  data: () => ({
    templates: [],
  }),
  created() {
    // const compendium =CompendiumStore();
    // this.templates = compendium.NpcTemplates;
  },
};
</script>
