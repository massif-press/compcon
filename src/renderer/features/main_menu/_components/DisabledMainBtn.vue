<template>
  <v-col cols="12">
    <div style="height: 70px">
      <div id="btn-main">
        <div id="unskew" class="heading pb-1">
          <v-icon color="grey lighten-2" size="50" class="ml-n4 mt-n2">cci-pilot</v-icon>
          <slot />
        </div>
      </div>
    </div>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'disabled-main-btn',
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
  color: rgb(230, 230, 230);
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

#btn-main {
  position: absolute;
  cursor: default;
  height: 70px;
  width: 620px;
  left: -30px;
  transform: skew(-0.65rad);
  background: rgb(190, 190, 190);
  z-index: 5;
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
</style>
