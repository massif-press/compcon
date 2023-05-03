<template>
  <div class="notificationContainer">
    <div class="v-menu__content--active" style="display: none; z-index: 1000"></div>
    <v-snackbar
      ref="snackbar"
      v-ripple="false"
      :value="true"
      :color="notificationVariant && notificationVariant.color"
      :timeout="-1"
      @mouseover="onInteract"
      @click.stop="onClick"
    >
      <v-icon dark prepend class="mr-2">
        {{ notificationVariant && notificationVariant.icon }}
      </v-icon>
      <span
        v-if="notificationVariant && notificationVariant.prefix"
        v-html="notificationVariant && notificationVariant.prefix"
      />
      &nbsp;
      <span v-html="notification.text" />
      <v-btn class="ml-auto" dark text @click.stop="$emit('dismiss-snackbar')">Dismiss</v-btn>
      <v-fade-transition>
        <v-progress-linear
          v-if="timeout > 0 && !interacted"
          ref="progress"
          v-model="timeoutValue"
          absolute
          bottom
          color="white"
          background-opacity="0"
        />
      </v-fade-transition>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
const notificationVariants: { [key: string]: INotificationVariant } = {
  error: {
    color: 'error',
    icon: '$error',
    prefix: '<b>ERROR:</b>',
    timeout: 0,
  },
  success: {
    color: 'success',
    icon: 'mdi-check',
    timeout: 4000,
  },
  confirmation: {
    color: 'secondary',
    icon: '$info',
    timeout: 4000,
  },
  achievement: {
    color: 'success',
    icon: 'mdi-trophy',
    prefix: '<b>Achivement Unlocked:</b>',
    timeout: 6000,
  },
};

export default {
  name: 'NotificationSnackbar',
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    notificationVariant() {
      return (
        notificationVariants[this.notification.variant] ?? notificationVariants['confirmation']
      );
    },
    timeout() {
      return this.notificationVariant.timeout ?? 6000;
    },
    isClickable(): boolean {
      return typeof this.notification.onClick === 'function';
    },
  },
  data: () => ({
    timeoutValue: 100,
    timeoutRef: null,
    interacted: false,
  }),
  methods: {
    async onInteract() {
      if (this.interacted || this.timeout === 0) return;
      // stop timeout if interaction detected
      this.setProgressTransition(500);
      // wait for next tick so that the transition duration change takes
      await this.$nextTick();
      this.interacted = true;
      clearTimeout(this.timeoutRef);
    },
    //
    isClickable() {
      return typeof this.notification.onClick === 'function';
    },
    onClick() {
      if (!this.isClickable) return;
      this.notification.onClick();
      this.$emit('dismiss-snackbar');
    },
    setProgressTransition(duration: number) {
      const el = (this.$refs.progress as any).$el as HTMLElement;
      el.style.transitionDuration = `${duration}ms`;
    },
    async doTimeoutProgress() {
      this.setProgressTransition(this.timeout);
      await this.$nextTick();
      this.timeoutValue = 0;
    },
  },

  async mounted() {
    await this.$nextTick();
    if (this.timeout > 0) {
      this.doTimeoutProgress();
      this.timeoutRef = setTimeout(() => {
        this.$emit('dismiss-snackbar');
      }, this.timeout);
    }
  },
};
</script>

<style scoped>
.notificationContainer {
  margin-left: auto;
}

.notificationContainer :deep(.v-snack) {
  /* pointer-events: all; */
  position: static;
  /* need to unset all relative pos. values as v-ripple sets position to relative temporarily */
  bottom: unset;
  right: unset;
  left: unset;
  top: unset;
  border-radius: 0px;
}

.notificationContainer :deep(.v-snack__wrapper) {
  min-width: 40vw;
  max-width: 70vw;
  border-radius: 0px;
}

.notificationContainer :deep(.v-snack__content) {
  border-radius: 0px;
  position: relative;
}

.notificationContainer :deep(.v-progress-linear__determinate) {
  transition-timing-function: linear;
}
</style>
