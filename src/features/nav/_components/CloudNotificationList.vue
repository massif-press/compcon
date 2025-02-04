<template>
  <v-card flat border tile>
    <v-list v-if="store.CloudNotifications.length" density="compact">
      <v-list-item
        v-for="(notification, idx) in store.CloudNotifications"
        :title="notification.text"
        :prepend-icon="notification.type === 'error' ? 'mdi-alert-circle' : 'mdi-information'"
        :color="notification.type === 'error' ? 'error' : ''">
        <template #append>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <cc-button
                v-bind="props"
                icon="mdi-close"
                size="small"
                variant="text"
                class="ml-2"
                @click="store.removeCloudNotification(idx)" />
            </template>
            <span>Dismiss</span>
          </v-tooltip>
        </template>
      </v-list-item>
      <v-btn size="x-small" variant="tonal" block tile @click="store.clearCloudNotifications()">
        Dismiss All Notifications
      </v-btn>
    </v-list>
    <v-card-text v-else>
      <i class="text-disabled">No recent cloud updates</i>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'CloudNotificationsList',
  computed: {
    store() {
      return UserStore();
    },
  },
};
</script>
