<template>
  <v-flex class="mb-1 text-xs-center">
    <v-card flat dark>
      <v-card-text class="header">
        <span>{{attr}}</span>      
      </v-card-text>
      <v-card-text class="p-0">
        <span class="value">
          <span v-if="signed">{{val > -1 ? '+' : '-'}}</span>
          {{Math.abs(val)}}
        </span>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
  name: 'statblock-item',
  props: {
    attr: String,
    val: Number,
    signed: Boolean
  }
})
</script>

<style scoped>
  .header {
    background-color: #757575;
    color: #EEEEEE;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 3px;
  }

  .value {
    color: #ffffff;
    font-size: 4em;
    line-height: 1em;
    font-weight: 300
  }
</style>

