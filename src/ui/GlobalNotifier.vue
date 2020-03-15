<template>
  <div id="notifier">
    <transition-group
      name="snackFade"
      tag="div"
      class="d-flex flex-column align-right notifierContainer"
    >
      <notification-snackbar
        v-for="notification in shownNotifications"
        :key="notification.id"
        class="mb-1 align-end snackFade"
        :notification="notification"
        :timeout="5000"
        @dismiss="hideNotification(notification.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import uuid from 'uuid/v4'

import NotificationSnackbar from './NotificationSnackbar.vue'
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

@Component({
  components: { NotificationSnackbar }
})
export default class GlobalNotifier extends Vue {
  // TODO: move this to the store
  public notifications: INotification[] = []

  // notifications currently being shown to the user
  private shownNotifications: INotification[] = []

  // public method to create a notification, will be assigned to the global Vue when app starts
  public notify(text: string, variant: string, onClick?: () => void) {
    const notification = { id: uuid(), variant, text, onClick }

    this.notifications = [...this.notifications, notification]
    this.shownNotifications = [...this.shownNotifications, notification]
    this.$forceUpdate()
  }

  public notifyError(error: Error, vm?: Vue) {
    const nm = getModule(NavStore, this.$store)
    nm.logError({
      time: new Date(),
      message: error.message,
      component: vm?.$options?.name ?? undefined,
      stack: error.stack
    })
    this.notify(error.message, 'error')
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
  transform-origin: center right;
}

.snackFade-enter,
.snackFade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>