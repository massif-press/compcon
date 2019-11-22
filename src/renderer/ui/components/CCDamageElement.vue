<template>
  <div>
    <div
      v-for="(d, i) in damage"
      :key="`dmg_${i}`"
      class="text-center ml-auto mr-auto"
      style="display: inline-block"
    >
      <cc-tooltip :title="d.Type || ''" :content="d.Text || ''">
        <span v-if="small">
          <v-icon :color="d.Color">{{ d.Icon }}</v-icon>
          <v-icon v-if="d.Override">mdi-information-outline</v-icon>
          <span v-else>{{ d.Value }}</span>
        </span>
        <div v-else class="clip-icon">
          <v-icon x-large :color="d.Color">{{ d.Icon }}</v-icon>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        &nbsp;{{ d.Value }}
        <br />
        <div class="overline mt-n1">
          <b>{{ d.Type }}</b>
          Damage
        </div>
      </span>
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
    small: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
