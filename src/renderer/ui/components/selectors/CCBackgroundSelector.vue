<template>
  <div>
    <v-icon @click="$refs.dialog.show()">cci-orbit</v-icon>
    <cc-solo-dialog ref="dialog" fullscreen no-confirm title="Select Pilot Background">
      <cc-sidebar-view popup>
        <v-list-item
          v-for="(e, i) in backgrounds"
          :key="`${i}_sidebar'`"
          slot="sidebar"
          link
          @click="
            $vuetify.goTo(`#e_${e.name}`, {
              duration: 150,
              easing: 'easeInOutQuad',
              offset: 25,
            })
          "
        >
          <v-list-item-title class="heading h3 ml-2">{{ e.name }}</v-list-item-title>
        </v-list-item>
        <br />
        <cc-titled-panel
          v-for="(e, i) in backgrounds"
          :id="`e_${e.name}`"
          :key="`${e.name}_${i}`"
          icon="cci-orbit"
          :title="e.name"
          color="primary"
          class="ma-3 ml-5"
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
  data: () => ({
    backgrounds: [],
  }),
  mounted() {
    this.backgrounds = backgrounds
  },
})
</script>