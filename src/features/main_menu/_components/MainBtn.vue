<template>
  <v-col cols="12">
    <div style="height: 70px">
      <div
        id="btn-main"
        @mouseenter="$emit('hover')"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
        @click="$router.push(to)"
      >
        <div id="unskew" class="heading pb-1">
          <v-icon dark size="50" class="ml-n4 mt-n2">cci-pilot</v-icon>
          <slot />
        </div>
      </div>
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
      required: true,
    },
  },
  data: () => ({
    mouseOver: false,
  }),
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
  left: -30px;
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
  background: var(--v-panel-base);
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
  background: var(--v-panel-base);
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
#btn-main:hover::before {
  left: 650px;
  background: var(--v-active-base);
  transition: all ease-in-out 0.45s;
}
</style>
