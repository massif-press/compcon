<template>
  <div v-if="!tag.IsHidden">
    <cc-tooltip :err="tag.err" :title="tag.Name" :content="tag.Description">
      <v-chip class="px-2 py-2 mx-2" :color="tag.err ? 'error' : color" dark label :small="small">
        <v-avatar>
          <v-icon v-if="tag.err" small>label_off</v-icon>
          <v-icon v-else small>label</v-icon>
        </v-avatar>
        <span v-if="tag.err">MISSING DATA</span>
        <span v-else>{{ tag.Name }}</span>
      </v-chip>
    </cc-tooltip>
  </div>
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
    small: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
