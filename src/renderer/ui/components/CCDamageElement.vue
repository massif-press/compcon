<template>
  <div>
    <div
      v-for="(d, i) in damage"
      :key="`dmg_${i}`"
      class="text-center mx-1"
      style="display: inline-block"
    >
      <cc-tooltip :title="d.Type || ''" :content="d.Text || ''">
        <div class="clip-icon">
          <v-icon x-large :color="d.Color">{{d.Icon}}</v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!icon">{{d.Value}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-damage-element',
  props: {
    damage: {
      type: Array,
      required: true,
    },
    icon: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>