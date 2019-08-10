<template>
  <div style="position: relative; max-width: fit-content; display: inline-block">
    <div class="shadow" :style="`background:${getColor()}`">
      <v-btn tile class="clipped" v-bind="$props" @click="$emit('click')">
        <span :class="small ? '' : 'heading h2 align'" style="display: contents">
          &nbsp;
          <slot></slot>&nbsp;&nbsp;
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
    'x-large': {
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
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    dark: {
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
    },
  },
  methods: {
    getColor(): string {
      if (this.color.substring(0, 1) === '#') return this.color
      return this.$vuetify.theme.currentTheme[this.color]
    },
  },
})
</script>

<style scoped>
.clipped {
  visibility: visible;
  clip-path: polygon(
    20px 0,
    100% 0,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    0 100%,
    0 20px
  );
}

.shadow {
  visibility: hidden;
}

.shadow::before {
  visibility: visible;
  content: ' ';
  position: absolute;
  width: 21px;
  height: 21px;
  clip-path: polygon(0 0, 0% 100%, 100% 0);
  background: inherit;
  z-index: 100;
  transition: all 0.2s ease-in-out;
}

.shadow::after {
  visibility: visible;
  content: ' ';
  position: absolute;
  width: 21px;
  height: 21px;
  bottom: 0px;
  right: 0px;
  clip-path: polygon(100% 100%, 0% 100%, 100% 0);
  background: inherit;
  z-index: 100;
  transition: all 0.2s ease-in-out;
}
.shadow:hover::before {
  transform: translate(-5px, -2px);
}

.shadow:hover::after {
  transform: translate(5px, 2px);
}

.align {
  line-height: 28pt;
}
</style>
