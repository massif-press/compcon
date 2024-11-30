<template>
  <v-menu v-if="store.IsLoggedIn" v-model="menu" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn size="x-small" icon variant="text" class="ml-1" v-bind:="props">
        <v-badge
          :model-value="store.CloudNotifications.length > 0"
          overlap
          color="secondary"
          :content="store.CloudNotifications.length">
          <v-icon size="x-large" icon="mdi-bell" />
        </v-badge>
      </v-btn>
    </template>
    <cloud-notification-list />
  </v-menu>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import CloudNotificationList from './_components/CloudNotificationList.vue';

export default {
  name: 'CloudNotifications',
  components: { CloudNotificationList },
  data: () => ({
    menu: false,
  }),
  computed: {
    store() {
      return UserStore();
    },
  },
};
</script>
