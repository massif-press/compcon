<template>
  <v-snackbar v-model="model" :color="color" tile right style="z-index: 9999">
    <slot></slot>
    <v-btn color="white" text @click="model = false">
      <v-icon large>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'cc-notification' })
export default class CCNotification extends Vue{

  @Prop({ type: String, required: false, default: 'primary', })
  readonly color: string
    
  model = false
  close() {
    this.model = false
  }
  open() {
    this.model = true
  }
}
</script>
