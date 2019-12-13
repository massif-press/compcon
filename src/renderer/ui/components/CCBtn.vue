<template>
  <div style="position: relative; max-width: fit-content; display: inline-block">
    <div :class="disabled ? 'disabled' : ''" class="wings" :style="`background:${bgColor}`">
      <v-btn
        tile
        class="clipped-btn"
        v-bind="$props"
        style="visibility: visible;"
        :style="`visibility: visible; background-color: ${bgColor} !important`"
        @click="$emit('click')"
      >
        <span :class="!xLarge ? '' : 'heading h3 align'" style="display: contents">
          &nbsp;
          <slot></slot>
          &nbsp;&nbsp;
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-btn',
  props: {
    large: {
      type: Boolean,
      required: false,
      default: false,
    },
    xLarge: {
      type: Boolean,
      required: false,
      default: false,
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    dark: {
      type: Boolean,
      required: false,
      default: true,
    },
    light: {
      type: Boolean,
      required: false,
      default: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
    to: {
      type: [String, Object],
      required: false,
      default: '',
    },
  },
  computed: {
    bgColor(): string {
      if (this.disabled) return 'gray'
      else return this.getColor(this.color, this.$vuetify)
    }
  }
})
</script>

<style scoped>
.wings {
  visibility: hidden;
}

.wings::before {
  visibility: visible;
  content: ' ';
  position: absolute;
  width: 21px;
  height: 21px;
  clip-path: polygon(0 0, 0% 100%, 100% 0);
  background: inherit;
  z-index: 1;
  transition: all 0.2s ease-in-out, background-color 1ms;
}

.wings::after {
  visibility: visible;
  content: ' ';
  position: absolute;
  width: 21px;
  height: 21px;
  bottom: 0px;
  right: 0px;
  clip-path: polygon(100% 100%, 0% 100%, 100% 0);
  background: inherit;
  z-index: 1;
  transition: all 0.2s ease-in-out, background-color 1ms;
}
.wings:not(.disabled):hover::before {
  transform: translate(-6px, 0px);
}

.wings:not(.disabled):hover::after {
  transform: translate(6px, 0px);
}

.align {
  line-height: 10pt;
}
</style>
