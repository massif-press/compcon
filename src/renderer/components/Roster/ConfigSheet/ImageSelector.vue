<template>
<v-container>
  <v-card flat>
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
</template>

<script>
  import io from '@/store/data_io'

  export default {
    name: 'image-selector',
    props: {
      preselect: String,
      default_img: String
    },
    data: () => ({
      images: []
    }),
    methods: {
      assignImage: function (src) {
        this.$emit('assign-img', src)
      },
      importAll: function () {
        var vm = this
        vm.images = io.getImages('frame', this.userDataPath).sort(function (a, b) {
          return a === vm.preselect ? 0 : 1
        })
      },
      importImage: function (imgType) {
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
        io.importImage(this.userDataPath, imgType, path[0])
        this.importAll()
        this.$forceUpdate()
      }
    },
    mounted: function () {
      this.importAll()
    }
  }
</script>

<style scoped>
  .clickable {
    cursor: pointer!important;
  }
  .clickable:hover {
    background-color: #0D47A1;
  }
  .preselected {
    background-color: #81D4FA;
    border: solid 2px #0D47A1;
  }
</style>
