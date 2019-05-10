<template>
  <v-container>
    <v-container grid-list-sm fluid>
      <v-layout row>
        <v-flex xs10>
          <v-btn block outline large color="primary" @click="importImage('portrait')">Import Portrait Image</v-btn>
        </v-flex>
        <v-divider vertical class="ml-2 mr-2" />
        <v-flex xs2>
          <v-switch v-model="cloud" @change="checkCloudSave">
            <span slot="label">Save to Cloud           
              <v-tooltip top >
                <v-icon small slot="activator" color="grey" class="mb-1">help</v-icon>
                <span>This pilot's portrait will be stored in the cloud, and<br>
                the image URL will be appended to this pilot's COMP/CON data.<br>
                When exporting this pilot, other users will see their custom<br>
                portrait, provided they are connected to the internet.</span>
              </v-tooltip>
            </span> 
          </v-switch>
        </v-flex>
      </v-layout>
      <v-divider class="mb-2" />
      <v-layout row justify-space-between wrap fill-height align-center>
        <v-flex v-if="cloudPortrait" xs3> 
          <div :class="`justify-center pa-1 cloud`">
            <v-img :src="cloudPortrait" position="top" max-height="40vh" max-width="40vw" contain style="opacity: 1!important"/>
            <v-tooltip top>
              <v-icon slot="activator" x-large style="z-index:20; position: absolute; left: 80%; top: 85%;">cloud</v-icon>
              <span>Saved to Cloud</span>
            </v-tooltip>
          </div>
        </v-flex>
        <v-flex v-for="i in portraits" :key="i" xs3> 
          <div :class="`justify-center pa-1 ${i === preselectPortrait && !cloudPortrait ? 'preselected' : 'fadeSelect'} clickable`" @click="assignPortrait(i)">
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
  import apis from '../../logic/apis'

  export default Vue.extend({
    name: 'image-selector',
    props: {
      preselectPortrait: String,
      cloudPortrait: String,
    },
    data: () => ({
      cloud: false,
      portraits: []
    }),
    methods: {
      assignPortrait (src: string) {
        if (this.cloud) this.cloudSave(src)
        this.$store.dispatch('editPilot', {
          attr: `portrait`,
          val: src
        })
        this.$emit('notify', 'Pilot Portrait Saved')
        this.$emit('close')
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
      },
      checkCloudSave (toggle: boolean) {
        if (toggle) {
          if (this.preselectPortrait) this.cloudSave(this.preselectPortrait)
        }
        else {
          this.$store.dispatch('editPilot', {
            attr: 'cloud_portrait',
            val: ''
          })        
        }
      },
      cloudSave(src: string) {
        var vm = this as any
        apis.uploadImage(vm.userDataPath, 'portrait', src).then(function (json: any) {
          vm.$store.dispatch('editPilot', {
            attr: 'cloud_portrait',
            val: json.data.link
          })
          vm.$emit('notify', 'Cloud Upload Successful')
        })
        .catch(function (err: any) {
          vm.emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
        });
      }
    },
    mounted () {
      this.importAll()
    },
    created () {
      if (this.cloudPortrait && this.cloudPortrait.length) this.cloud = true
    }
  })
</script>

<style scoped>
  .preselected {
    border: 3px solid #81D4FA;
    border-radius: 5px;
  }

  .cloud {
    border: 5px solid #43A047;
    border-radius: 5px;
    position: relative;
  }
</style>
