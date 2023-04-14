<template>
  <div id="notifier">
    <transition-group
      name="snackFade"
      tag="div"
      class="d-flex flex-column align-right notifierContainer"
    >
      <notification-snackbar
        v-for="notification in shownNotifications"
        class="mb-1 align-end snackFade"
        :notification="notification"
        :timeout="5000"
        @dismiss-snackbar="hideNotification(notification.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid';

import NotificationSnackbar from './NotificationSnackbar.vue';
import { INotification } from '@/interface';

export default {
  name: 'GlobalNotifier',
  components: { NotificationSnackbar },
  data: () => ({
    notifications: [] as INotification[],
    shownNotifications: [] as INotification[],
  }),
  methods: {
    notify(title: string, variant: string, onClick?: () => void): void {
      const notification = { id: uuid(), variant, text, onClick };

      this.notifications = [...this.notifications, notification];
      this.shownNotifications = [...this.shownNotifications, notification];
      this.$forceUpdate();
    },
    notifyError(error: Error): void {
      if (!error || !error.message) return;
      console.error(error.message);
      const vm = this;
      // const store = (this as any).$store;
      // nm.logError({
      //   time: new Date(),
      //   message: error.message,
      //   component: vm?.$options?.name ?? undefined,
      //   stack: error.stack,
      // });
      // this.notify(error.message, 'error');
    },
    hideNotification(id: string): void {
      this.shownNotifications = this.shownNotifications.filter(
        (notif) => notif.id !== id
      );
    },
  },
};
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
