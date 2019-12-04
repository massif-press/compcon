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
        <span class="flavor-text grey--text">{{ images.length }} {{ type }} images found</span>
        <cc-tooltip simple content="Feature In Development">
          <v-btn class="ml-4" small outlined tile disabled>Manage image library</v-btn>
        </cc-tooltip>
        <v-spacer />
        <cc-btn small color="secondary" class="ml-auto" @click="importImage()">
          <v-icon>add_circle_outline</v-icon>
          &emsp; add image to collection
        </cc-btn>
        <cc-btn v-if="item.Image" small color="error" class="ml-4" @click="assignImage('')">
          <v-icon>remove_circle_outline</v-icon>
          &emsp;Clear Assigned Image
        </cc-btn>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-if="item.CloudImage" cols="3">
          <div class="pa-1 cloud`">
            <v-img
              :src="item.CloudImage"
              aspect-ratio="1"
              max-width="300px"
              style="opacity: 1!important"
            />
            <cc-tooltip simple content="Saved to Cloud">
              <v-icon x-large style="z-index:20; position: absolute; left: 80%; top: 85%;">
                cloud
              </v-icon>
            </cc-tooltip>
          </div>
        </v-col>
        <v-col v-for="i in images" :key="i" cols="3">
          <div
            :class="
              `text-xs-right pa-1 ${
                i === item.LocalImage && !item.CloudImage ? 'preselected' : 'fadeSelect'
              } clickable`
            "
            @click="assignImage(i)"
          >
            <v-btn
              small
              fab
              color="grey lighten-2"
              relative
              style="top:25px; left: 0; z-index: 100"
              class="img-button"
              @click.stop
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
              @click.stop
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
              :src="`file://${userDataPath}/img/${type.toLowerCase()}/${i}`"
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
import { getImageInfoArray, addImage, removeImage, ImageTag } from '@/io/ImageManagement'
import apis from '@/io/apis'

export default Vue.extend({
  name: 'image-selector',
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    cloud: false,
    images: [],
  }),
  mounted() {
    this.importAll()
  },
  methods: {
    assignImage(src: string) {
      if (this.cloud) this.cloudSave(src)
      else this.item.SetLocalImage(src)
      this.$refs.dialog.hide()
    },
    deleteImage(src: string) {
      if (src === this.item.LocalImage) {
        this.item.SetLocalImage('')
      }
      removeImage(this.type, src)
      this.importAll()
      this.$forceUpdate()
    },
    importAll() {
      const vm = this as any
      this.images = getImageInfoArray(this.type)
        .map(x => x.filename)
        .sort(function(a) {
          return a === vm.item.portrait ? 0 : 1
        })
    },
    importImage() {
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
      console.log(path[0])
      addImage(this.type, path[0])
      this.importAll()
      this.$forceUpdate()
    },
    checkCloudSave(toggle: boolean) {
      if (toggle) {
        if (this.item.LocalImage) this.cloudSave(this.item.LocalImage)
      } else {
        this.item.SetCloudImage('')
      }
    },
    cloudSave(src: string) {
      apis
        .uploadImage(this.userDataPath, 'portrait', src)
        .then(function(json: any) {
          this.item.SetCloudImage(json.data.link)
          this.$emit('notify', 'Cloud Upload Successful')
        })
        .catch(function(err: any) {
          this.$emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
        })
    },
    open() {
      this.$refs.dialog.show()
    },
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
