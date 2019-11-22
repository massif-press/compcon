<template>
  <span
    :class="interior ? 'ml-n2 heading h3 white--text' : 'heading h3 text--text'"
    style="line-height: 35px"
  >
    <v-icon v-if="item.IsUnshackled" color="warning" class="mt-n1">
      mdi-link-variant-off
    </v-icon>
    <span v-if="!item.IsDestroyed">{{ item.Name }}</span>
    <span v-else class="error--text" style="text-decoration: line-through;">
      {{ item.Name }}
    </span>
    <cc-tooltip v-if="item.SP" simple inline :content="`${item.SP} SP`">
      <v-icon
        v-for="n in item.SP"
        :key="`sp_${item.ID}-${n}`"
        :color="color ? color : ''"
        :dark="!color ? dark : false"
        size="16"
        class="ml-n1"
      >
        mdi-flash
      </v-icon>
    </cc-tooltip>
    <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
      <v-icon small color="active">mdi-note</v-icon>
    </cc-tooltip>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'equipment-header',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    interior: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
  },
})
</script>
