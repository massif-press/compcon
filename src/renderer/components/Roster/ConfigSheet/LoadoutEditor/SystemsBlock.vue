<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
          <span class="mount-title pl-3 pr-3">Systems</span>
          <v-card-text class="bordered ml-3 pt-4">
          <mech-system-item empty/> 
          </v-card-text>
          <span class="bottom-title pl-3 pr-3">X/Y SP</span>
        </v-card>
  </div>
</template>

<script>
import MechSystemItem from './MechSystemItem'

export default {
  name: 'systems-block',
  props: {
    mount: Object
  },
  components: { MechSystemItem }
}
</script>

<style>
  .mount-title {
    position: relative;
    top: 15px;
    left: 30px;
    background-color: #616161;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 0;
  }

  .bottom-title {
    position: absolute;
    bottom: 10px;
    right: 45px;
    background-color: #616161;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 0;
  }

  .bordered {
    border: solid 2px #424242; 
  }
</style>
