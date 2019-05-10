<template>
  <v-container>
    <v-container grid-list-sm fluid>
        <v-btn block outline large color="primary" @click="importImage('portrait')">Import Portrait Image</v-btn>
      <v-divider />
      <v-layout row justify-space-between wrap fill-height align-center>
        <v-flex v-for="i in portraits" :key="i" xs3> 
          <div :class="`justify-center pa-1 ${i === preselectPortrait ? 'preselected' : 'fadeSelect'} clickable`" @click="assignPortrait(i)">
            <v-img :src="`file://${userDataPath}/img/portrait/${i}`" position="top" max-height="40vh" max-width="40vw" contain style="opacity: 1!important"/> 
          </div>
        </v-flex>
      </v-layout>
    </v-container>   
    <v-btn large flat color="error" @click="assignPortrait('')"><v-icon>remove_circle_outline</v-icon>&emsp;Remove Portrait</v-btn> 
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/features/_shared/data_io'

  export default Vue.extend({
    name: 'image-selector',
    props: {
      preselectPortrait: String
    },
    data: () => ({
      portraits: []
    }),
    methods: {
      assignPortrait (src: string) {
        this.$emit('assign-portrait', src)
      },
      importAll () {
        var vm = this as any
        vm.portraits = io.getImages('portrait', vm.userDataPath).sort(function (a, b) {
          return a === vm.preselectPortrait ? 0 : 1
        })
      },
      importImage (imgType: string) {
        var vm = this as any
        const { dialog } = require('electron').remote
        var path = dialog.showOpenDialog({
          title: 'Load Image',
          buttonLabel: 'Load',
          properties: [
            'openFile'
          ],
          filters: [
            { name: 'Image', extensions: ['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp'] }
          ]
        })
        io.importImage(vm.userDataPath, imgType, path[0])
        vm.importAll()
        vm.$forceUpdate()
      }
    },
    mounted () {
      this.importAll()
    }
  })
</script>

<style scoped>
  .preselected {
    background-color:#81D4FA;
  }
</style>