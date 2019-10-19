<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    fullscreen
    no-confirm
    title="Select Image"
  >
    <v-container fluid>
      <v-row style="margin-top: 60px">
        <span class="flavor-text grey--text">{{ portraits.length }} Pilot images found</span>
        <cc-tooltip simple content="Feature In Development">
          <v-btn class="ml-4" small outlined tile disabled>Manage image library</v-btn>
        </cc-tooltip>
        <v-spacer />
        <cc-btn small color="secondary" class="ml-auto" @click="importImage()">
          <v-icon>add_circle_outline</v-icon>&emsp;
          add image to collection
        </cc-btn>
        <cc-btn v-if="pilot.Portrait" small color="error" class="ml-4" @click="assignPortrait('')">
          <v-icon>remove_circle_outline</v-icon>&emsp;Clear Assigned Portrait
        </cc-btn>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-if="pilot.CloudPortrait" cols="3">
          <div class="pa-1 cloud`">
            <v-img
              :src="pilot.CloudPortrait"
              aspect-ratio="1"
              max-width="300px"
              style="opacity: 1!important"
            />
            <cc-tooltip simple content="Saved to Cloud">
              <v-icon x-large style="z-index:20; position: absolute; left: 80%; top: 85%;">cloud</v-icon>
            </cc-tooltip>
          </div>
        </v-col>
        <v-col v-for="i in portraits" :key="i" cols="3">
          <div
            :class="
              `text-xs-right pa-1 ${
                i === pilot.LocalPortrait && !pilot.CloudPortrait ? 'preselected' : 'fadeSelect'
              } clickable`
            "
            @click="assignPortrait(i)"
          >
            <v-btn
              small
              fab
              color="grey lighten-2"
              relative
              style="top:25px; left: 0; z-index: 100"
              class="img-button"
              @click.stop="''"
            >
              <cc-tooltip simple content="Feature In Development">
                <v-icon color="grey">mdi-magnify-plus</v-icon>
              </cc-tooltip>
            </v-btn>
            <v-btn
              small
              fab
              color="white"
              relative
              style="top:25px; left: 10px; z-index: 100"
              class="img-button"
              @click.stop="''"
            >
              <cc-tooltip simple content="Feature In Development">
                <v-icon color="grey">mdi-palette</v-icon>
              </cc-tooltip>
            </v-btn>
            <v-btn
              small
              fab
              color="white"
              relative
              style="top:25px; left: 20px; z-index: 100"
              class="img-button"
              @click.stop="deleteImage(i)"
            >
              <cc-tooltip simple content="Delete Image">
                <v-icon color="error">mdi-delete</v-icon>
              </cc-tooltip>
            </v-btn>
            <v-img
              :src="`file://${userDataPath}/img/pilot/${i}`"
              position="top"
              aspect-ratio="1"
              max-width="300px"
              class="bordered"
              style="opacity: 1!important"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
// import io from '@/features/_shared/data_io'
import { getImageInfoArray, addImage, removeImage, ImageTag } from '@/io/ImageManagement'
import apis from '@/features/_shared/apis'
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
      // this.$emit('notify', 'Pilot Portrait Saved')
      this.$refs.dialog.hide()
    },
    deleteImage(src: string) {
      if (src === this.pilot.LocalPortrait) {
        this.pilot.SetLocalPortrait('')
      }
      removeImage(ImageTag.Pilot, src)
      this.importAll()
      this.$forceUpdate()
    },
    importAll() {
      var vm = this as any
      vm.portraits = getImageInfoArray(ImageTag.Pilot)
        .map(x => x.filename)
        .sort(function(a, b) {
          return a === vm.pilot.portrait ? 0 : 1
        })
    },
    importImage() {
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
      addImage(ImageTag.Pilot, path[0])
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
    open() {
      this.$refs.dialog.show()
    },
  },
  mounted() {
    this.importAll()
  },
})
</script>

<style scoped>
.img-button {
  opacity: 0.25;
  transition: opacity 0.25s;
}

.clickable:hover .img-button {
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
