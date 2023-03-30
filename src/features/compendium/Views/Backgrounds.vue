<template>
  <sidebar-array-view
    title="PILOT BACKGROUNDS"
    :array="backgrounds"
    icon="cc:orbit"
    name-key="Name"
    description-key="Description"
    sub-key="LcpName"
    sub-conditional="InLcp"
  />
</template>

<script lang="ts">
import SidebarArrayView from '../components/SidebarArrayView.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'backgrounds',
  components: { SidebarArrayView },
  data: () => ({
    backgrounds: [],
  }),
  created() {
    this.backgrounds = CompendiumStore().Backgrounds;
  },
};
</script>
