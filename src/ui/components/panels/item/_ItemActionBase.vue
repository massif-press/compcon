<template>
  <div class="pr-2">
    <div :class="color">
      <v-row dense align="start" class="px-2">
        <v-col v-if="!print && !noIcon" cols="auto">
          <v-icon x-large color="white">
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col class="mt-n2 white--text">
          <div class="overline font-weight-bold mb-n2" v-html="type" />
          <div class="heading h3" v-html="action.name" />
        </v-col>
      </v-row>
    </div>
    <div class="rounded-border panel py-1 px-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-action-base',
  props: {
    color: {
      type: String,
      required: false,
      default: 'free',
    },
    action: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: 'cci-free-action',
    },
    type: {
      type: String,
      required: false,
      default: 'EFFECT',
    },
    limitedBonus: {
      type: Number,
      required: false,
      default: 0,
    },
    noIcon: { type: Boolean },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>

<style scoped>
.rounded-border {
  border-radius: 3px;
}
</style>
