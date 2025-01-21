<template>
  <v-tabs v-model="tab" density="compact">
    <v-tab>Account Management</v-tab>
    <v-tab>Cloud Data</v-tab>
    <v-tab>Content Subscriptions</v-tab>
    <v-tab>Content Publishing</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item>
      <Management @set-state="$emit('set-state', $event)" />
    </v-window-item>
    <v-window-item>
      <Data />
    </v-window-item>
    <v-window-item>
      <Subscriptions />
    </v-window-item>
    <v-window-item>
      <Publishing />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import Data from './data.vue';
import Management from './management.vue';
import Publishing from './publishing.vue';
import Subscriptions from './subscriptions.vue';

export default {
  name: 'cloud-account',
  components: { Data, Management, Subscriptions, Publishing },
  data: () => ({
    tab: 0,
  }),
  emits: ['set-state'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
