<template>
  <div>
    <v-icon :small="small" color="secondary" @click="open()">cci-orbit</v-icon>
    <cc-solo-dialog ref="dialog" fullscreen no-confirm title="Select Pilot Background">
      <cc-sidebar-view>
        <v-list-item
          v-for="(e, i) in backgrounds"
          :key="`${i}_sidebar'`"
          slot="sidebar"
          link
          @click="
            $vuetify.goTo(`#e_${e.ID}`, {
              duration: 250,
              easing: 'easeInOutQuad',
              offset: 25,
              container: '.v-dialog--active',
            })
          "
        >
          <v-list-item-title class="heading h3 ml-2">{{ e.Name }}</v-list-item-title>
        </v-list-item>
        <br />
        <v-row v-for="(e, i) in backgrounds" :id="`e_${e.ID}`" :key="`${e.ID}_${i}`" dense>
          <v-col>
            <cc-titled-panel
              icon="cci-orbit"
              :title="e.Name"
              class="ma-3 ml-5"
              clickable
              @click="choose(e.Name)"
            >
              <h3 v-if="e.InLcp" class="heading mb-2" v-html-safe="e.LcpName" />
              <p class="flavor-text" v-html-safe="e.Description" />
            </cc-titled-panel>
          </v-col>
        </v-row>
      </cc-sidebar-view>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

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
      this.backgrounds = getModule(CompendiumStore, this.$store).Backgrounds
    },
    choose(background: string) {
      this.$emit('select', background)
      this.$refs.dialog.hide()
    },
  },
})
</script>
