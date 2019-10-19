<template>
  <v-col>
    <v-card flat tile color="grey lighten-3" class="clipped-large">
      <v-card-title class="primary white--text py-0 heading h3" style="height: 28px">
        {{ title }}
        <cc-tooltip v-if="extended" simple inline content="Extended Harness">
          <v-icon dark right small class="mt-n1">mdi-alpha-e-box-outline</v-icon>
        </cc-tooltip>
        <v-spacer />
        <div class="text-right">
          <v-btn v-if="item" icon dark>
            <v-icon class="fadeSelect">delete</v-icon>
          </v-btn>
          <v-btn icon dark @click="$refs.selector.show()">
            <v-icon class="fadeSelect">mdi-circle-edit-outline</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text class="px-2 text-center">
        <slot v-if="item" />
        <div v-else class="py-3">
          <br />
          <span
            class="heading h2 grey--text fadeSelect"
            style="margin: 0 auto; width: 100px; cursor: pointer"
            @click="$refs.selector.show()"
          >// EMPTY //</span>
        </div>
      </v-card-text>
    </v-card>
    <cc-solo-dialog ref="selector" no-confirm :title="`Equip ${title}`" fullscreen no-pad>
      <!-- <slot name= @close="$refs.selector.hide()" /> -->
    </cc-solo-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'pl-pilot-armor-card',
  props: {
    title: {
      type: String,
      required: true,
    },
    item: {
      type: [Object, null],
      required: true,
    },
    extended: {
      type: Boolean,
      required: false,
    },
  },
})
</script>