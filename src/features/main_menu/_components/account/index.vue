<template>
  <cc-tabs ref="tabs"
    modal
    fixed>
    <template #tabs>
      <v-tab>Account Management</v-tab>
      <v-tab>Cloud Data</v-tab>
      <v-tab>Content Subscriptions</v-tab>
      <v-tab>Content Publishing</v-tab>
    </template>
    <v-window-item>
      <Management @set-state="$emit('set-state', $event)" />
    </v-window-item>
    <v-window-item>
      <data-tab @reset="($refs as any).tabs.setTab(0)" />
    </v-window-item>
    <v-window-item>
      <Subscriptions />
    </v-window-item>
    <v-window-item>
      <Publishing />
    </v-window-item>
  </cc-tabs>
</template>

<script lang="ts">
import DataTab from './data.vue';
import Management from './management.vue';
import Publishing from './publishing.vue';
import Subscriptions from './subscriptions.vue';

export default {
  name: 'CloudAccount',
  components: { DataTab, Management, Subscriptions, Publishing },
  emits: ['set-state'],
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
