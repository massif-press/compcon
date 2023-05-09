<template>
  <cc-sidebar-view>
    <template #sidebar>
      <v-list-item v-for="e in statuses" slot="sidebar" link @click="scrollTo(e)">
        <v-list-item-title class="heading h4">{{ e.name }}</v-list-item-title>
      </v-list-item>
    </template>
    <h1 class="heading mt-3 mb-n3">STATUSES & EFFECTS</h1>
    <v-container>
      <cc-titled-panel
        v-for="e in statuses"
        :id="`e_${e.name.replace(/\W/g, '')}`"
        :title="e.name"
        class="my-4"
        density="compact"
      >
        <template #items>
          <div class="flavor-text text-white" v-text="e.type" />
        </template>
        <v-row align="center" class="pb-2 mt-n5">
          <v-col cols="auto">
            <v-icon
              v-if="e.icon"
              size="80"
              color="accent"
              :icon="`cc:${e.type.toLowerCase()}_${e.icon.replaceAll(/-|_/g, '').toLowerCase()}`"
            />
          </v-col>
          <v-col><p v-html-safe="e.effects" class="mb-0 text-stark body-text" /></v-col>
        </v-row>
      </cc-titled-panel>
    </v-container>
  </cc-sidebar-view>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'statuses',
  computed: {
    statuses(): Status[] {
      return CompendiumStore().Statuses;
    },
  },
  methods: {
    scrollTo(e: any): void {
      const el = document.getElementById(`e_${(e as any)['name'].replace(/\W/g, '')}`);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>
