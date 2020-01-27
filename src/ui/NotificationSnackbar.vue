<template>
  <div class="notificationContainer">
    <v-snackbar
      v-ripple="isClickable"
      v-model="isOpen"
      :style="{ cursor: isClickable ? 'pointer' : 'inherit' }"
      :value="true"
      :color="notificationVariant && notificationVariant.color"
      :timeout="interacted ? timeout : 0"
      @mouseover="onInteract"
      @click="onClick"
      ref="snackbar"
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
      <v-btn class="ml-auto" dark text @click="$emit('dismiss')">
        Dismiss
      </v-btn>
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
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch, Ref } from 'vue-property-decorator'
import { VSnackbar } from 'vuetify/lib'

const notificationVariants: { [key: string]: INotificationVariant } = {
  'error': {
    color: 'error',
    icon: '$error',
    prefix: '<b>ERROR:</b>',
    timeout: 0,
  },
  'confirmation': {
    color: 'secondary',
    icon: '$info',
    timeout: 4000,
  },
  'achievement': {
    color: 'success',
    icon: 'mdi-trophy',
    prefix: '<b>Achivement Unlocked:</b>',
    timeout: 6000,
  }
}

@Component
export default class Notification extends Vue {

  @Prop({ type: Object, required: true }) notification: INotification

  // utility function that sets the transition-duration of the progress-linear component
  @Ref('progress') progress!: Vue

  private setProgressTransition(duration: number) {
    const el = this.progress.$el as HTMLElement
    el.style.transitionDuration = `${duration}ms`
  }

  timeoutValue: number = 100
  private async doTimeoutProgress() {
    this.setProgressTransition(this.timeout)
    await this.$nextTick()
    this.timeoutValue = 0
  }

  async mounted() {
    await this.$nextTick()
    if (this.timeout > 0) this.doTimeoutProgress()
  }

  isOpen = true;
  @Watch('isOpen')
  onChange(newValue: boolean) {
    if (newValue === false) {
      this.$emit('closed')
    }
  }

  get notificationVariant() {
    return notificationVariants[this.notification.variant] ?? notificationVariants['confirmation']
  }

  get timeout() {
    return this.notificationVariant.timeout ?? 6000
  }

  @Ref('snackbar') snackbar!: { setTimeout: () => void }
  interacted = false;
  async onInteract() {
    if (this.interacted || this.timeout === 0) return;
    // stop timeout if interaction detected
    this.setProgressTransition(500)
    // wait for next tick so that the transition duration change takes
    await this.$nextTick()
    // this will set `this.timeout` to 0
    this.interacted = true
    // need to execute this method of the v-snackbar object to get it to actually take the timeout change
    // tightly couples, but oh well
    this.snackbar.setTimeout()
  }

  // 
  get isClickable() {
    return typeof this.notification.onClick === 'function'
  }

  onClick() {
    if (!this.isClickable) return
    this.notification.onClick()
    this.$emit('dismiss')
  }

}
</script>

<style scoped>
.notificationContainer {
  margin-left: auto;
}

.notificationContainer >>> .v-snack {
  pointer-events: all;
  position: static;
  /* need to unset all relative pos. values as v-ripple sets position to relative temporarily */
  bottom: unset;
  right: unset;
  left: unset;
  top: unset;
  border-radius: 0px;
}

.notificationContainer >>> .v-snack__wrapper {
  min-width: 600px;
  max-width: 70vw;
  border-radius: 0px;
}

.notificationContainer >>> .v-snack__content {
  border-radius: 0px;
  position: relative;
}

.notificationContainer >>> .v-progress-linear__determinate {
  transition-timing-function: linear;
}
</style>