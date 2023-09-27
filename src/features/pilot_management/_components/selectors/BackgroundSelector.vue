<template>
  <v-icon :small="small" color="secondary" class="fade-select" @click="open()">cc:orbit</v-icon>
  <cc-solo-dialog id="bs-dialog" ref="dialog" fullscreen no-confirm title="Select Pilot Background">
    <cc-compendium-browser
      :items="backgrounds"
      item-type="Background"
      :options="options"
      equippable
      @equip="
        $emit('select', $event.Name);
        ($refs.dialog as any).hide();
      "
    >
      <template #header>
        <div class="heading h4 text-center text-primary mt-2">
          Select Pilot Background
        </div></template
      >
    </cc-compendium-browser>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Background } from '@/class';
import SidebarArrayView from '@/features/compendium/components/SidebarArrayView.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'background-selector',
  components: { SidebarArrayView },
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
  methods: {
    open() {
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
