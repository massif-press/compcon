<template>
  <v-container>
    <v-container grid-list-sm fluid>
      <v-layout row>
        <v-flex xs10>
          <v-btn
            block
            outline
            large
            color="primary"
            @click="importImage('portrait')"
          >
            Import Portrait Image
          </v-btn>
        </v-flex>
        <v-divider vertical class="ml-2 mr-2" />
        <v-flex xs2>
          <v-switch v-model="cloud" @change="checkCloudSave">
            <span slot="label">
              Save to Cloud
              <v-tooltip top>
                <v-icon small slot="activator" color="grey" class="mb-1">
                  help
                </v-icon>
                <span>
                  This pilot's portrait will be stored in the cloud, and
                  <br />
                  the image URL will be appended to this pilot's COMP/CON data.
                  <br />
                  When exporting this pilot, other users will see their custom
                  <br />
                  portrait, provided they are connected to the internet.
                </span>
              </v-tooltip>
            </span>
          </v-switch>
        </v-flex>
      </v-layout>
      <v-divider class="mb-2" />
      <v-layout row justify-space-between wrap fill-height align-center>
        <v-flex v-if="pilot.CloudPortrait" xs3>
          <div :class="`justify-center pa-1 cloud`">
            <v-img
              :src="pilot.CloudPortrait"
              position="top"
              max-height="40vh"
              max-width="40vw"
              contain
              style="opacity: 1!important"
            />
            <v-tooltip top>
              <v-icon
                slot="activator"
                x-large
                style="z-index:20; position: absolute; left: 80%; top: 85%;"
              >
                cloud
              </v-icon>
              <span>Saved to Cloud</span>
            </v-tooltip>
          </div>
        </v-flex>
        <v-flex v-for="i in portraits" :key="i" xs3>
          <div
            :class="
              `text-xs-right justify-center pa-1 ${
                i === pilot.LocalPortrait && !pilot.CloudPortrait
                  ? 'preselected'
                  : 'fadeSelect'
              } clickable`
            "
            @click="assignPortrait(i)"
          >
            <v-tooltip top>
              <v-btn
                slot="activator"
                small
                icon
                color="error"
                relative
                style="top: 25px; z-index: 100"
                class="delete"
                @click.stop="deleteImage(i)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <span>Delete Image</span>
            </v-tooltip>
            <v-img
              :src="`file://${userDataPath}/img/portrait/${i}`"
              position="top"
              max-height="40vh"
              max-width="40vw"
              contain
              style="opacity: 1!important"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn large flat color="error" @click="assignPortrait('')">
      <v-icon>remove_circle_outline</v-icon>
      &emsp;Remove Portrait
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import io from '@/features/_shared/data_io'
import apis from '../../logic/apis'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'image-selector',
  props: {
    pilot: Pilot,
  },
  data: () => ({
    cloud: false,
    portraits: [],
  }),
  methods: {
    assignPortrait(src: string) {
      if (this.cloud) this.cloudSave(src)
      else this.pilot.SetLocalPortrait(src)
      this.$emit('notify', 'Pilot Portrait Saved')
      this.$emit('close')
    },
    deleteImage(src: string) {
      if (src === this.pilot.LocalPortrait) {
        this.pilot.SetLocalPortrait('')
      }
      io.deleteImage('portrait', this.userDataPath, src)
      this.importAll()
      this.$forceUpdate()
    },
    importAll() {
      var vm = this as any
      vm.portraits = io
        .getImages('portrait', vm.userDataPath)
        .sort(function(a, b) {
          return a === vm.pilot.portrait ? 0 : 1
        })
    },
    importImage(imgType: string) {
      var vm = this as any
      const { dialog } = require('electron').remote
      var path = dialog.showOpenDialog({
        title: 'Load Image',
        buttonLabel: 'Load',
        properties: ['openFile'],
        filters: [
          {
            name: 'Image',
            extensions: ['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp'],
          },
        ],
      })
      io.importImage(vm.userDataPath, imgType, path[0])
      vm.importAll()
      vm.$forceUpdate()
    },
    checkCloudSave(toggle: boolean) {
      if (toggle) {
        if (this.pilot.LocalPortrait) this.cloudSave(this.pilot.LocalPortrait)
      } else {
        this.pilot.SetCloudPortrait('')
      }
    },
    cloudSave(src: string) {
      var vm = this as any
      apis
        .uploadImage(vm.userDataPath, 'portrait', src)
        .then(function(json: any) {
          vm.pilot.SetCloudPortrait(json.data.link)
          vm.$emit('notify', 'Cloud Upload Successful')
        })
        .catch(function(err: any) {
          vm.emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
        })
    },
  },
  mounted() {
    this.importAll()
  },
  created() {
    if (this.pilot.CloudPortrait) this.cloud = true
  },
})
</script>

<style scoped>
.delete {
  opacity: 0.25;
  transition: opacity 0.25s;
}

.delete:hover {
  opacity: 1;
}

.clickable {
  opacity: 0.55;
  transition: opacity 0.15s;
}

.clickable:hover {
  opacity: 1;
}

.preselected {
  background-color: 3px solid #81d4fa;
}

.cloud {
  border: 5px solid #43a047;
  border-radius: 5px;
  position: relative;
}
</style>
