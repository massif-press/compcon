<template>
  <v-menu v-if="store.IsLoggedIn" v-model="menu" :close-on-content-click="false">
    <template #activator="{ props }">
      <cc-button
        size="x-small"
        icon="mdi-bell"
        variant="outlined"
        color=""
        @click="menu = !menu"
        v-bind="props"></cc-button>
      <v-badge v-if="itemCount" color="warning" class="ml-1 mb-4" dot />
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
    itemCount() {
      return this.store.CloudNotifications.length;
    },
  },
};
</script>
