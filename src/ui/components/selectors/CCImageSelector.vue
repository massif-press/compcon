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
        <span class="flavor-text subtle--text">{{ images.length }} {{ type }} images found</span>
        <cc-tooltip simple content="Feature In Development">
          <v-btn class="ml-4" small outlined tile disabled>Manage image library</v-btn>
        </cc-tooltip>
        <v-spacer />
        <cc-btn small color="secondary" class="ml-auto" @click="importImage()">
          <v-icon>add_circle_outline</v-icon>
          &emsp; add image to collection
        </cc-btn>
        <cc-btn v-if="item.Image" small color="error" class="ml-4" @click="clearAssignedImage()">
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
              color="panel"
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

            <v-menu offset-y offset-x top nudge-left="30px">
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  fab
                  color="white"
                  relative
                  style="top:25px; left: 20px; z-index: 100"
                  class="img-button"
                  v-on="on"
                >
                  <cc-tooltip simple content="Delete Image">
                    <v-icon color="error">mdi-delete</v-icon>
                  </cc-tooltip>
                </v-btn>
              </template>
              <cc-confirmation
                content="Lancer, this will <span class='accent--text'> permanently delete this image.</span> Do you want to continue?"
                @confirm="$emit('remove-loadout')"
              />
            </v-menu>

            <v-img
              :src="imagePath(i)"
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
import { addImage, removeImage, getImagePath, getImagePaths } from '@/io/ImageManagement'
import imgur from '@/io/apis/imgur'
import { promisify } from 'util'
import { Capacitor } from '@capacitor/core'

let fs: typeof import('fs')

if (Capacitor.platform !== 'web') {
  fs = require('fs')
}

// TODO: no way to actually do save to cloud yet
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
    imagePath(i) {
      if (!this.type) return ''
      else return getImagePath(this.type, i)
    },
    async clearAssignedImage() {
      if (this.item.CloudImage) this.item.SetCloudImage('')
      this.item.SetLocalImage('')
      this.$refs.dialog.hide()
    },
    async assignImage(src: string) {
      if (this.cloud) await this.cloudSave(src)
      else this.item.SetLocalImage(src)
      this.$refs.dialog.hide()
    },
    async deleteImage(src: string) {
      if (src === this.item.LocalImage) {
        this.item.SetLocalImage('')
      }
      await removeImage(this.type, src)
      await this.importAll()
      this.$forceUpdate()
    },
    async importAll() {
      const paths = await getImagePaths(this.type)
      this.images = paths.sort(a => {
        return a === this.item.portrait ? 0 : 1
      })
    },
    async importImage() {
      const { dialog } = require('electron').remote
      const path = dialog.showOpenDialog({
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
      if (!path) return
      await addImage(this.type, path[0])
      await this.importAll()
      this.$forceUpdate()
    },
    async checkCloudSave(toggle: boolean) {
      if (toggle) {
        if (this.item.LocalImage) await this.cloudSave(this.item.LocalImage)
      } else {
        this.item.SetCloudImage('')
      }
    },
    async cloudSave(src: string) {
      const data = await promisify(fs.readFile)(getImagePath(this.type, src), {
        encoding: 'base64',
      })
      try {
        const link = await imgur.uploadImage(data)
        this.item.SetCloudImage(link)
        this.$emit('notify', 'Cloud Upload Successful')
      } catch (err) {
        this.$emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
      }
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
