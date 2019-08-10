<template>
  <v-flex style="position: relative;">
    <div
      @mouseenter="$emit('hover')"
      @mouseover="mouseOver = true"
      @mouseleave="mouseOver = false"
      id="btn-main"
      @click="$router.push(to)"
    >
      <div class="heading pb-1" id="unskew">
        <slot></slot>
      </div>
    </div>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'main-btn',
  data: () => ({
    mouseOver: false,
  }),
  props: ['to'],
})
</script>

<style scoped>
#unskew {
  transform: skew(0.65rad) !important;
  position: absolute;
  left: 50px;
  color: #fff;
  font-size: 28pt;
  margin-top: 4px;
}

#unskew::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  background-color: #fff;
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

#btn-main:hover > #unskew::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}

#btn-main {
  position: absolute;
  cursor: pointer;
  height: 70px;
  width: 620px;
  left: -60px;
  transform: skew(-0.65rad);
  background: var(--v-primary-base);
  z-index: 5;
  transition: all ease-in-out 0.45s;
}
#btn-main:hover {
  background-color: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
#btn-main::after {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 12px;
  background: white;
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
#btn-main:hover::after {
  left: 625px;
  background: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
#btn-main::before {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 8px;
  background: white;
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
#btn-main:hover::before {
  left: 650px;
  background: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
</style>


