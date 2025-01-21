<template>
  <v-tabs v-model="tab" color="accent" density="compact">
    <v-tab>Settings</v-tab>
    <v-tab>Storage</v-tab>
    <v-tab>Log</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item>
      <settings />
    </v-window-item>
    <v-window-item>
      <storage />
    </v-window-item>
    <v-window-item>
      <log />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import Settings from './Settings.vue';
import Storage from './Storage.vue';
import Log from './Log.vue';

export default {
  name: 'options',
  components: { Settings, Storage, Log },
  data: () => ({
    tab: 0,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
