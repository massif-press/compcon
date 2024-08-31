<template>
  <v-layout class="mt-2">
    <v-btn
      icon
      size="25"
      variant="tonal"
      color="primary"
      :style="`position: absolute; z-index: 999; left: ${showNav ? '260' : '3'}px; top: 12px`"
      @click="(showNav as any) = !showNav">
      <v-icon size="25" :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'" />
    </v-btn>
    <v-navigation-drawer v-model="showNav">
      <v-list density="compact" nav>
        <v-alert
          variant="outlined"
          class="mb-3 py-1"
          style="border-color: rgb(var(--v-theme-primary))">
          <div class="heading h3 text-center text-accent">Glossary</div>
        </v-alert>
        <v-text-field
          v-model="search"
          item-title="Name"
          prepend-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mt-2" />
        <v-divider class="mt-2" />
        <v-list-item
          v-for="e in glossary"
          :title="e.name"
          :active="!!selected && (selected as any).name === e.name"
          active-class="bg-primary"
          @click="
            selected = e;
            $nextTick(() => scrollTo(e.name));
          " />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div
        id="content"
        :style="`padding: 16px 64px 16px 64px`"
        style="height: calc(100vh - 65px) !important; overflow-y: scroll">
        <div v-for="e in glossary" :id="`e_${e.name.replace(/\W/g, '')}`" class="my-5">
          <cc-titled-panel :icon="icon || ''" :title="e.name" density="compact">
            <p v-html-safe="e.description" class="body-text mb-1" />
          </cc-titled-panel>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import _ from 'lodash';
import { glossary } from '@massif/lancer-data';

export default {
  name: 'glossary',
  data: () => ({
    showNav: null,
    array: glossary,
    icon: 'mdi-book-open-variant',
    search: '',
    selected: null,
  }),
  computed: {
    glossary() {
      return _.sortBy(glossary, [(x) => x.name]).filter((x) =>
        !this.search ? true : x.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    scrollTo(id: string) {
      const el = document.getElementById(`e_${id.replace(/\W/g, '')}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  },
};
</script>
