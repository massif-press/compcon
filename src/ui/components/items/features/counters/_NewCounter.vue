<template>
  <v-card
    tile
    color="primary"
    style="position: relative"
    :elevation="creating ? 12 : 0"
    :class="$vuetify.breakpoint.mdAndUp ? 'clipped-large text-center' : 'text-center'"
    :height="$vuetify.breakpoint.mdAndUp ? '118px' : '100%'"
    :width="$vuetify.breakpoint.mdAndUp ? '225px' : '100%'"
    :min-width="$vuetify.breakpoint.mdAndUp ? '225px' : '100%'"
  >
    <transition name="fade">
      <v-card-text
        v-if="creating"
        class="background"
        style="height: 100%; display: flex; flex-direction: column"
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
        <div class="py-1">
          <div>Add Custom Counter</div>
          <v-icon :v-if="$vuetify.breakpoint.mdAndUp">add</v-icon>
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
