<template>
  <div v-if="!tag.IsHidden">
    <cc-tooltip :err="tag.err" :title="tag.Name" :content="tag.Description">
      <v-chip class="px-2 py-2 mx-2" :color="tag.err ? 'error' : 'primary'" dark label>
        <v-avatar>
          <v-icon small v-if="tag.err">label_off</v-icon>
          <v-icon small v-else>label</v-icon>
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
  },
})
</script>
