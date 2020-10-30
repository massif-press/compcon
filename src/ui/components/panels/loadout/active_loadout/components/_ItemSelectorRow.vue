<template>
  <v-row no-gutters class="my-1">
    <v-col>
      <v-btn
        x-large
        block
        tile
        :color="selected ? 'secondary' : item.Color"
        :disabled="disabled"
        @click="$emit('click')"
      >
        <span style="position: absolute; left: 0">
          <v-icon large left>{{ item.Icon }}</v-icon>
          {{ item.Name }}
        </span>
        <span style="position: absolute; right: 0">
          <cc-damage-element v-if="item.Damage" :damage="item.Damage" small class="d-inline" />
          <cc-range-element v-if="item.Range" :range="item.Range" small class="d-inline" />
          <v-chip v-if="item.Frequency" small outlined v-html="item.Frequency.ToString()" />
        </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'weapon-selector-row',
  props: {
    item: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
})
</script>
