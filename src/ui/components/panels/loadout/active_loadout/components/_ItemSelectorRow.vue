<template>
  <v-row no-gutters class="my-1">
    <v-col>
      <v-btn x-large block dark tile :color="btnColor" :disabled="disabled" @click="$emit('click')">
        <span style="position: absolute; left: 0">
          <v-icon large left>{{ item.Icon }}</v-icon>
          {{ item.Name }}
        </span>
        <span style="position: absolute; right: 0">
          <cc-damage-element v-if="item.Damage" :damage="item.Damage" small class="d-inline" />
          <cc-range-element v-if="item.Range" :range="item.Range" small class="d-inline" />
          <v-chip v-if="item.Frequency" small outlined v-html-safe="item.Frequency.ToString()" />
        </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'item-selector-row',
  computed: {
    btnColor() {
      if (this.item.ItemType === 'MechWeapon' && !this.item.Loaded) return 'grey darken-2'
      else if (this.selected) return 'accent'
      return this.color
    },
  },
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
    overwatch: {
      type: Boolean,
    },
    color: {
      type: String,
      required: false,
      default: '',
    },
  },
})
</script>
