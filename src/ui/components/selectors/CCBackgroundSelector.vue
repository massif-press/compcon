<template>
  <v-icon :small="small" color="secondary" @click="open()">cc:orbit</v-icon>
  <cc-solo-dialog ref="dialog" fullscreen no-confirm title="Select Pilot Background">
    <sidebar-array-view
      :array="backgrounds"
      icon="cc:orbit"
      name-key="Name"
      description-key="Description"
      sub-key="LcpName"
      sub-conditional="InLcp"
      selectable
      @selected="
        $emit('select', $event);
        ($refs.dialog as any).hide();
      "
    />
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Background } from '@/class';
import SidebarArrayView from '@/features/compendium/components/SidebarArrayView.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'cc-background-selector',
  components: { SidebarArrayView },
  props: {
    small: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['select'],
  data: () => ({
    backgrounds: [],
  }),
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
