<template>
  <v-row column hidden-sm-and-down class="goblinchan">
    <v-slide-y-reverse-transition group>
      <b class="goblinchan-header primary--text" v-if="tips.length" key="header">
        GOBLIN-CHAN'S TIPS
      </b>
      <v-card
        class="popover"
        v-for="tip in tips"
        :class="tip.satisfied ? 'green--text' : 'red--text'"
        :key="tip.id"
      >
        <v-card-text class="tipbody" v-html="tip.text" />
      </v-card>
    </v-slide-y-reverse-transition>
    <div>
      <img :src="imgSource" alt="Goblin-chan" />
    </div>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'goblin-chan',
  props: { tips: { type: Array, required: true } },
  data: () => ({
    imgSource: require('../../../../../../static/goblinchan.png'),
  }),
})
</script>

<style scoped>
.goblinchan img {
  margin-top: 10px;
  width: 200px;
}
.goblinchan {
  color: initial !important;
  position: fixed;
  bottom: 30px;
  right: 10px;
}
/* overflow scroll */
.goblinchan > span {
  max-height: 45vh;
  overflow-y: auto;
}
.popover {
  position: relative;
  width: 200px;
  margin: 0.5em 0;
}
.tipbody {
  padding: 0.5rem 0.75rem;
}
.goblinchan-header {
  font-size: 0.8em;
  text-align: left;
  align-self: flex-start;
}
</style>
