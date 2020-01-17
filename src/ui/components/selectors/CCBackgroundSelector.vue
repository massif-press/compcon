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
              duration: 250,
              easing: 'easeInOutQuad',
              offset: 25,
              container: '.v-dialog--active',
            })
          "
        >
          <v-list-item-title class="heading h3 ml-2">{{ e.name }}</v-list-item-title>
        </v-list-item>
        <br />
        <v-row v-for="(e, i) in backgrounds" :id="`e_${e.id}`" :key="`${e.id}_${i}`" no-gutters>
          <v-col cols="1" class="mr-n5">
            <v-btn
              tile
              block
              text
              min-height="calc(100% - 24px)"
              class="pa-0 mt-3 fadeSelect"
              @click="choose(e.name)"
            >
              <cc-tooltip simple inline :content="`Select '${e.name}'`">
                <v-icon size="80" color="secondary">cci-accuracy</v-icon>
              </cc-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="11">
            <cc-titled-panel icon="cci-orbit" :title="e.name" class="ma-3 ml-5">
              <p class="flavor-text" v-html="e.description" />
            </cc-titled-panel>
          </v-col>
        </v-row>
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
