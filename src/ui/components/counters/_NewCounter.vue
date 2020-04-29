<template>
  <v-card
    tile
    color="primary"
    style="position: relative"
    :elevation="creating ? 12 : 0"
    class="clipped-large text-center"
    width="200px"
    height="118px"
  >
    <transition name="fade">
      <v-card-text
        v-if="creating"
        class="background"
        style="height: 100%; display: flex; flex-direction: column;"
      >
        <v-text-field
          ref="nameField"
          v-model="name"
          placeholder="Counter name"
          dense
          @keypress.esc="cancel"
          @keypress.enter="create"
        ></v-text-field>
        <v-row class="mt-auto">
          <v-col class="py-0">
            <v-btn color="secondary" style="height: 100%" block tile elevation="0" @click="cancel">
              CANCEL
            </v-btn>
          </v-col>
          <v-col class="py-0">
            <v-btn
              color="primary"
              style="height: 100%"
              block
              tile
              elevation="0"
              :disabled="!name"
              @click="create"
            >
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn
        v-else
        block
        tile
        color="primary"
        class="ml-n1"
        style="height: 100%"
        @click="startCreating"
      >
        <div>
          <div>Add Custom Counter</div>
          <v-icon class="mt-2">add</v-icon>
        </div>
      </v-btn>
    </transition>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class NewCounter extends Vue {
  creating = false

  name = ''

  async startCreating(): Promise<void> {
    this.creating = true
    await Vue.nextTick()
    ;(this.$refs.nameField as any).focus()
  }

  cancel(): void {
    this.name = ''
    this.creating = false
  }

  create(): void {
    if (!this.name) return
    this.$emit('create', this.name)
    this.name = ''
    this.creating = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
  position: absolute;
  width: 100%;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
