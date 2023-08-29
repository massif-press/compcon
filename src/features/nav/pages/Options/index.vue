<template>
  <div style="min-height: 600px; height: 60vh">
    <v-tabs v-model="tab" dark background-color="primary">
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
  </div>
</template>

<script lang="ts">
import Settings from './Settings.vue';
import Storage from './Storage.vue';
import Log from './Log.vue';
import Logger from '@/user/logger';

export default {
  name: 'options',
  components: { Settings, Storage, Log },
  data: () => ({
    tab: 0,
  }),
  mounted() {
    Logger.log('Options mounted');
  },
};
</script>
