<template>
  <transition-group name="snackFade" tag="div" id="notifier" class="container notifierContainer">
    <v-row
      class="mb-1 align-center snackFade"
      v-for="notification in shownNotifications"
      :key="notification.id"
    >
      <v-snackbar
        @input="onNotificationInput($event, notification.id)"
        :value="true"
        :color="colorFromType(notification.type)"
      >
        {{ notification.text }}
        <v-btn class="ml-auto" dark text @click="dismissNotification(notification.id)">
          Dismiss
        </v-btn>
      </v-snackbar>
    </v-row>
  </transition-group>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import uuid from 'uuid/v4'

enum NotificationType {
  Achievement, Confirmation, Error
}

interface INotification {
  id: string
  type: NotificationType,
  text: string
}

@Component
export default class GlobalNotifier extends Vue {
  // TODO: move this to the store
  public notifications: INotification[] = []

  // notifications currently being shown to the user
  private shownNotifications: INotification[] = []

  // public method to create a notification
  public notify(text: string, type: NotificationType = NotificationType.Confirmation) {
    console.log(text, type)
    const notification = { id: uuid(), type, text }

    this.notifications = [...this.notifications, notification]
    this.shownNotifications = [...this.shownNotifications, notification]
    this.$forceUpdate()
  }

  private dismissNotification(id: string) {
    this.shownNotifications = this.shownNotifications.filter(notif => notif.id !== id)
  }

  private onNotificationInput(event, id) {
    if (event === false) this.dismissNotification(id)
  }

  private colorFromType(type: string) {
    switch (type) {
      case 'Error':
        return 'error'
      case 'Confirmation':
        return 'info'
      case 'Achievement':
        return 'success'
      default:
        return null;
    }
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

.notifierContainer >>> .v-snack {
  pointer-events: all;
  position: static;
  margin: 0 auto;
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