<template>
  <v-hover class="clickable" style="background-color: rgba(0,0,0,0)">
    <v-card slot-scope="{ hover }" :class="`inactive elevation-${hover ? 12 : 0}`" @click="openConfigModal" style="height: 100%">
      <v-layout row>
        <v-flex class="ma-0 pb-0 pt-0 text-xs-center">
          <div :style="`height: ${cardHeight}px; display:table; width:100%; cursor: pointer;`">
            <span class="pilot-letter white--text"><v-icon dark size="20vw">cc-frame</v-icon></span>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex class="pb-0">
          <v-card color="transparent" flat>
            <v-card-text class="text-xs-center white--text">
              <span class="font-weight-light center-align add-letter">Add New Mech</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <lazy-dialog :model="newConfigModal" title="Delete Mech Configuration" @cancel="newConfigModal = false">
        <template v-slot:modal-content><add-config-menu @close="goToConfig"/></template>
      </lazy-dialog>

    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import AddConfigMenu from './AddConfigMenu.vue'
import {LazyDialog} from '../components/UI'

export default Vue.extend({
  name: 'add-config-card',
  components: {AddConfigMenu, LazyDialog},
  props: {
    cardHeight: Number,
  },
  data: () => ({
    newConfigModal: false,
    newConfigLoader: false
  }),
  methods: {
    openConfigModal () {
      this.newConfigLoader = true
      this.newConfigModal = true
    },
    goToConfig () {
      this.newConfigModal = false
      this.newConfigLoader = false
      this.$emit('added')
    }
  }
})
</script>

<style scoped>
 .pilot-letter {
   display:table-cell; 
   vertical-align:middle; 
   text-align:center;
   font-size: 20vw;
   line-height: 0;
 }

 .add-letter {
    letter-spacing:3px; 
    font-size:35px
 } 

 .active {
   background: linear-gradient(#283593, #424242 80%);
   background-color: #424242;
 }

  .inactive {
   background: linear-gradient(#616161, #424242 80%);
   background-color: #424242;
 }

  .inactive:hover {
   background: linear-gradient(#546E7A, #616161 80%);
   border: 0px
 }
</style>
