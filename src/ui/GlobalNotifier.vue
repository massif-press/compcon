<template>
  <transition-group id="notifier" name="snackFade" tag="div" class="container notifierContainer">
    <v-row
      v-for="notification in shownNotifications"
      :key="notification.id"
      class="mb-1 align-end snackFade"
    >
      <notification-snackbar
        :notification="notification"
        :timeout="5000"
        @closed="hideNotification(notification.id)"
        @dismiss="hideNotification(notification.id)"
      />
    </v-row>
  </transition-group>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import uuid from 'uuid/v4'

import NotificationSnackbar from './NotificationSnackbar.vue'

@Component({
  components: { NotificationSnackbar }
})
export default class GlobalNotifier extends Vue {
  // TODO: move this to the store
  public notifications: INotification[] = []

  // notifications currently being shown to the user
  private shownNotifications: INotification[] = []

  // public method to create a notification, will be assigned to the global Vue when app starts
  public notify(text: string, type: string) {
    const notification = { id: uuid(), type, text }

    this.notifications = [...this.notifications, notification]
    this.shownNotifications = [...this.shownNotifications, notification]
    this.$forceUpdate()
  }

  private hideNotification(id: string) {
    this.shownNotifications = this.shownNotifications.filter(notif => notif.id !== id)
  }

}
</script>

<style scoped>
.notifierContainer {
  pointer-events: none;
  z-index: 9999;
  position: fixed;
  left: 8px;
  right: 8px;
  bottom: 8px;
}

.snackFade {
  transition-property: opacity, transform;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.snackFade-enter,
.snackFade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>