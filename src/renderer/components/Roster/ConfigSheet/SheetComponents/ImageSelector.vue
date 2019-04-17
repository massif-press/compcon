<template>
  <v-dialog lazy v-model="model" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="edit-btn mlneg" small flat icon color="primary">
      <v-icon small>edit</v-icon>
    </v-btn>
    <v-container>
      <v-card flat>
        <v-toolbar fixed dense flat>
          <v-toolbar-title>Set Custom Image</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon large @click="model = false"><v-icon large>close</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container grid-list-sm fluid>
          <v-btn block outline large color="primary" @click="importImage('frame')">Import Custom Frame Image</v-btn>
          <v-divider />
          <v-layout row justify-space-between wrap fill-height align-center>
            <v-flex xs3> 
              <div class="clickable" @click="assignImage(null)">
                <v-img :src="default_img" position="top" max-height="40vh" max-width="40vw" contain/> 
              </div>
            </v-flex>
            <v-flex v-for="i in images" :key="i" xs3> 
              <div :class="`justify-center pa-1 ${i === preselect ? 'preselected' : 'clickable'}`" @click="assignImage(i)">
                <v-img :src="`file://${userDataPath}/img/frame/${i}`" position="top" max-height="40vh" max-width="40vw" contain/> 
              </div>
            </v-flex>
          </v-layout>
        </v-container>   
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/store/data_io'

  export default Vue.extend({
    name: 'image-selector',
    props: {
      model: Boolean,
      preselect: String,
      default_img: String
    },
    data: () => ({
      images: []
    }),
    methods: {
      assignImage (src: string) {
        this.$emit('assign-img', src)
      },
      importAll () {
        var vm = this as any
        vm.images = io.getImages('frame', vm.userDataPath).sort(function (a, b) {
          return a === vm.preselect ? 0 : 1
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
  .clickable:hover {
    background-color: #0D47A1;
  }
  .preselected {
    background-color: #81D4FA;
    border: solid 2px #0D47A1;
  }
</style>
