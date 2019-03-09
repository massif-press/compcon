<template>
  <v-flex class="mb-1 text-xs-center">
    <v-card flat dark>
      <v-card-text class="header">
        <span> {{attr}}</span>      
      </v-card-text>
      <v-card-text class="p-0">
        <span class="value">{{val}}</span>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'statblock-item',
  props: [
    'attr',
    'val'
  ]
}
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
    font-size: 4.5em;
    font-weight: 300
  }
</style>

