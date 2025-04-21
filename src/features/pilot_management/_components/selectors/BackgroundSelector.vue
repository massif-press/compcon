<template>
  <cc-modal id="bs-dialog" ref="dialog" fullscreen no-confirm title="Select Pilot Background" clip>
    <template #activator="{ open }">
      <v-icon :small="small" color="accent" variant="plain" class="ml-1" @click="open">
        cc:orbit
      </v-icon>
    </template>
    <template #default="{ close }">
      <cc-compendium-browser
        :items="backgrounds"
        item-type="Background"
        :options="options"
        equippable
        @equip="
          $emit('select', $event.Name);
          close();
        ">
        <template #header>
          <div class="heading h4 text-center text-accent">Select Pilot Background</div>
        </template>
      </cc-compendium-browser>
    </template>
  </cc-modal>
</template>

<script lang="ts">
import { Background } from '@/class';

import { CompendiumStore } from '@/stores';

export default {
  name: 'background-selector',
  props: {
    small: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  emits: ['select'],
  computed: {
    backgrounds(): Background[] {
      return CompendiumStore().Backgrounds;
    },
  },
};
</script>
