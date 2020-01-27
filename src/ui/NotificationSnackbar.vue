<template>
  <div class="notificationContainer">
    <v-snackbar
      v-model="isOpen"
      :value="true"
      :color="colorFromType(notification.type)"
      :timeout="timeout"
    >
      <v-icon dark prepend class="mr-2">{{ iconFromType(notification.type) }}</v-icon>
      {{ notification.text }}
      <v-btn class="ml-auto" dark text @click="$emit('dismiss')">
        Dismiss
      </v-btn>
      <v-progress-linear
        v-if="timeout > 0"
        ref="progress"
        v-model="timeoutValue"
        absolute
        bottom
        color="white"
        background-opacity="0"
      />
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

@Component
export default class Notification extends Vue {

  @Prop({ type: Object, required: true }) notification: INotification
  @Prop({ type: Number, required: true }) timeout: number

  timeoutValue: number = 100
  private async doTimeoutProgress() {
    const el = (this.$refs.progress as Vue).$el as HTMLElement
    el.style.transitionDuration = `${this.timeout}ms`
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

  private iconFromType(type: string) {
    switch (type) {
      case 'Error':
        return '$error'
      case 'Confirmation':
        return '$info'
      case 'Achievement':
        return 'mdi-trophy'
      default:
        return null;
    }
  }
}
</script>

<style scoped>
.notificationContainer {
  margin: 0 auto;
}

.notificationContainer >>> .v-snack {
  pointer-events: all;
  position: static;
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