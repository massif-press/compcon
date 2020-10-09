<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--full">
        <v-icon x-large>mdi-hexagon-slice-6</v-icon>
        Barrage
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-spacer v-if="$vuetify.breakpoint.mdAndDown" class="titlebar-margin" />

      <v-card-text class="mb-0 pb-2">
        <weapon-attack ref="main" :item="item" :mech="mech" :mount="mount">
          <div class="heading h2 mt-3 mb-n3">
            <v-icon x-large class="mt-n2 mr-n1">cci-mech-weapon</v-icon>
            {{ item.Name }}
          </div>
        </weapon-attack>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import WeaponAttack from '../components/_WeaponAttack.vue'

export default Vue.extend({
  name: 'superheavy-barrage-dialog',
  components: { WeaponAttack },
  props: {
    item: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    reset() {
      this.$refs.main.reset()
    },
    confirm(): void {
      this.dialog = false
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      console.log('sh hide')
      this.dialog = false
    },
  },
})
</script>
