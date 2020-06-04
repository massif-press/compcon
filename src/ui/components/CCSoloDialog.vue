<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen || $vuetify.breakpoint.mdAndDown"
    :width="small ? '30vw' : large ? '85vw' : '50vw'"
    :style="fullscreen || $vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
  >
    <v-card tile class="background">
      <cc-titlebar :clipped="!noTitleClip" large :icon="icon" :color="color" :fixed="fullscreen">
        {{ title }}
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="fullscreen" class="titlebar-margin" />

      <v-card-text :style="noPad ? 'padding: 0!important' : ''">
        <slot />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="noConfirm">
        <v-spacer />
        <v-btn text @click="hide">dismiss</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn text @click="hide">cancel</v-btn>
        <v-spacer />
        <cc-btn @click="confirm">confirm</cc-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({ name: 'cc-solo-dialog' })
export default class CCSoloDialog extends Vue {
  @Prop({ type: String, required: false, default: 'primary' })
  readonly color: string
  @Prop({ type: String, required: false, default: '' })
  readonly icon: string

  @Prop({ type: Boolean, required: false })
  readonly small?: boolean
  @Prop({ type: Boolean, required: false })
  readonly large?: boolean

  @Prop({ type: Boolean, required: false })
  readonly fullscreen?: boolean

  @Prop({ type: Boolean, required: false })
  readonly noConfirm?: boolean
  @Prop({ type: Boolean, required: false })
  readonly noPad?: boolean
  @Prop({ type: Boolean, required: false })
  readonly noTitleClip?: boolean

  @Prop({ type: String, required: false })
  readonly title?: string

  dialog = false
  @Emit()
  confirm(): void {
    this.dialog = false
  }
  show(): void {
    this.dialog = true
  }
  hide(): void {
    this.dialog = false
  }
}
</script>

<style scoped>
.titlebar-margin {
  padding-top: 60px;
}
</style>
