<template>
  <v-alert
    v-show="!tag.IsHidden"
    outlined
    dense
    prominent
    icon="label"
    color="primary"
    border="left"
  >
    <span v-if="tag.err">ERR: MISSING DATA</span>
    <div v-else>
      <h3 class="heading primary--text">
        {{ tag.GetName() }}
      </h3>
      <p class="flavor-text pb-0 mb-0" v-html="tag.GetDescription()" />
    </div>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-tag',
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
})
</script>
