<template>
  <v-col class="col-container" cols="12">
    <div style="height: 70px">
      <div
        class="btn-main"
        :class="{
          disabled: disabled || loading,
          grey: disabled,
        }"
        @mouseenter="$emit('hover')"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
        @click="to ? $router.push(to) : $emit('clicked')"
      >
        <div class="unskew heading pb-1">
          <v-icon dark size="50" class="ml-n4 mt-n3">{{ icon }}</v-icon>
          <slot />
        </div>
        <v-progress-linear v-if="loading" absolute bottom color="white" indeterminate />
      </div>
    </div>
    <div
      class="d-inline overline help-text"
      style="position:absolute; left: 150px; width: fit-content!important"
    >
      > {{ help }}
    </div>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'main-btn',
  props: {
    to: {
      type: String,
      required: false,
      default: '',
    },
    help: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    icon: {
      type: String,
      default: 'cci-pilot',
    },
  },
  data: () => ({
    mouseOver: false,
  }),
})
</script>

<style scoped>
.unskew {
  transform: skew(0.65rad) !important;
  position: absolute;
  left: 50px;
  color: #fff;
  font-size: 28pt;
  margin-top: 4px;
}

.unskew::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  background-color: var(--v-background-base);
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

.btn-main:not(.disabled):hover > .unskew::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}

.btn-main {
  position: absolute;
  cursor: pointer;
  height: 70px;
  width: 620px;
  left: -30px;
  transform: skew(-0.65rad);
  background: var(--v-primary-base);
  z-index: 5;
  transition: all ease-in-out 0.45s;
}
.btn-main:not(.disabled):hover {
  background-color: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
.btn-main::after {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 12px;
  background: var(--v-background-base);
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
.btn-main:not(.disabled):hover::after {
  left: 625px;
  background: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
.btn-main::before {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 8px;
  background: var(--v-background-base);
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
.btn-main:not(.disabled):hover::before {
  left: 650px;
  background: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}

.btn-main.disabled,
.btn-main.disabled .unskew {
  cursor: default;
}

.help-text {
  opacity: 0.5;
  color: var(--v-text-base);
  transition: all ease-in-out 0.45s;
  margin-left: -125px;
}

.col-container:hover .help-text {
  opacity: 1;
  color: var(--v-accent-base);
  font-weight: bolder;
}
</style>
