<template>
<v-container>
<v-tabs v-model="tabController">
  <v-tab>Pilot Portrait</v-tab>
  <v-tab-item>
    <v-card flat>
        <v-container grid-list-sm fluid>
            <v-btn block outline large color="primary" @click="importImage('portrait')">Import Portrait Image</v-btn>
          <v-divider />
          <v-layout row justify-space-between wrap fill-height align-center>
            <v-flex v-for="i in portraits" :key="i" xs3> 
              <div :class="`justify-center pa-1 ${i === preselectPortrait ? 'preselected' : 'clickable'}`" @click="assignPortrait(i)">
                <v-img :src="`file://${userDataPath}/img/portrait/${i}`" position="top" max-height="40vh" max-width="40vw" contain/> 
              </div>
            </v-flex>
          </v-layout>
        </v-container>   
        <v-btn large flat color="error" @click="assignPortrait('')"><v-icon>remove_circle_outline</v-icon>&emsp;Remove Portrait</v-btn> 
    </v-card>
  </v-tab-item>
  </v-tabs>
  </v-container>
</template>

<script>
  import io from '@/store/data_io'

  export default {
    name: 'image-selector',
    props: {
      preselectPortrait: String
    },
    data: () => ({
      tabController: null,
      done: false,
      portraits: []
    }),
    methods: {
      assignPortrait: function (src) {
        this.$emit('assign-portrait', src)
        this.tabController = 1
      },
      importAll: function () {
        var vm = this
        vm.portraits = io.getImages('portrait', this.userDataPath).sort(function (a, b) {
          return a === vm.preselectPortrait ? 0 : 1
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
