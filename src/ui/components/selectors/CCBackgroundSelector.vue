<template>
  <div>
    <v-icon :small="small" color="secondary" @click="open()">cci-orbit</v-icon>
    <cc-solo-dialog
      id="bg-selector-dialog"
      ref="dialog"
      fullscreen
      no-confirm
      title="Select Pilot Background"
    >
      <cc-sidebar-view>
        <v-list-item
          v-for="(e, i) in backgrounds"
          :key="`${i}_sidebar'`"
          slot="sidebar"
          link
          @click="
            $vuetify.goTo(`#e_${e.id}`, {
              duration: 150,
              easing: 'easeInOutQuad',
              offset: 25,
              container: '#bg-selector-dialog'
            })
          "
        >
          <v-list-item-title class="heading h3 ml-2">{{ e.name }}</v-list-item-title>
        </v-list-item>
        <br />
        <cc-titled-panel
          v-for="(e, i) in backgrounds"
          :id="`e_${e.id}`"
          :key="`${e.id}_${i}`"
          icon="cci-orbit"
          :title="e.name"
          color="primary"
          class="ma-3 ml-5"
          clickable
          @click="choose(e.name)"
        >
          <p class="flavor-text" v-html="e.description" />
        </cc-titled-panel>
      </cc-sidebar-view>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { backgrounds } from 'lancer-data'

export default Vue.extend({
  name: 'cc-background-selector',
  props: {
    small: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    backgrounds: [],
  }),
  methods: {
    open() {
      this.$refs.dialog.show()
      this.backgrounds = backgrounds
    },
    choose(background: string) {
      this.$emit('select', background)
      this.$refs.dialog.hide()
    },
  },
})
</script>