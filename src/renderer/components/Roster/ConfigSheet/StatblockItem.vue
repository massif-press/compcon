<template>
  <v-flex class="d-flex justify-content-center">
    {{attr}}: <span class="val" :id="attr + val">&nbsp;{{val}}</span>
    <b-popover :target="attr + val"
      placement="bottom"
      triggers="hover focus"
      :content="`todo: breakdown of contributing factors to this value`" />
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
  .val {
    font-weight: bold;
    font-size: 16px;
  }
</style>
