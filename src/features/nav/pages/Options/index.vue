<template>
  <cc-tabs fixed modal>
    <template #tabs>
      <v-tab>Settings</v-tab>
      <v-tab>Storage</v-tab>
      <v-tab>Log</v-tab>
    </template>
    <v-window-item>
      <settings />
    </v-window-item>
    <v-window-item>
      <storage />
    </v-window-item>
    <v-window-item>
      <log />
    </v-window-item>
  </cc-tabs>
</template>

<script lang="ts">
import Settings from './Settings.vue';
import Storage from './Storage.vue';
import Log from './Log.vue';

export default {
  name: 'options',
  components: { Settings, Storage, Log },
};
</script>
