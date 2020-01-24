<template>
  <div>
    <v-dialog v-model="dialog" :width="small ? '30vw' : large ? '80vw' : '50vw'">
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="flat"
          :small="smallBtn"
          :large="large"
          :color="color"
          text
          :dark="dark"
          v-on="on"
        >
          <slot name="button"></slot>
        </v-btn>
        <cc-btn v-else :small="smallBtn" :large="large" :color="color" v-on="on">
          <slot name="button"></slot>
        </cc-btn>
      </template>

      <v-card tile>
        <cc-titlebar :color="color">
          <slot name="title"></slot>
          <slot slot="items" name="title-items"></slot>
        </cc-titlebar>

        <v-card-text>
          <slot></slot>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="noConfirm">
          <v-spacer />
          <v-btn text @click="dialog = false">dismiss</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn text @click="dialog = false">cancel</v-btn>
          <v-spacer />
          <cc-btn @click="confirm">confirm</cc-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'


@Component({ name: 'cc-dialog' })
export default class CCDialog extends Vue {
  @Prop({ type: Boolean, })
  small?: boolean 
  @Prop({ type: Boolean, })
  smallBtn?: boolean 
  @Prop({ type: Boolean, })
  large?: boolean 

  @Prop({ type: String, required: false, default: 'primary', })
  color: string 

  @Prop({ type: Boolean, })
  flat?: boolean 
  @Prop({ type: Boolean, })
  dark?: boolean 
  @Prop({ type: Boolean, })
  noConfirm?: boolean

  dialog: false

  @Emit()
  confirm() {
    this.dialog = false
  }
}
</script>
