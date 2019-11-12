<template>
  <v-dialog lazy v-model="display" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="edit-btn mlneg" small flat icon color="primary">
      <v-icon small>edit</v-icon>
    </v-btn>
    <v-card flat>
      <v-container>
        <v-toolbar fixed dense flat>
          <v-toolbar-title>Set Custom Image</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon large @click="close">
              <v-icon large>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container grid-list-sm fluid>
          <v-row>
            <v-col cols="10">
              <v-btn block outline large color="primary" @click="importImage('frame')">
                Import Custom Frame Image
              </v-btn>
            </v-col>
            <v-divider vertical class="ml-2 mr-2" />
            <v-col cols="2">
              <v-switch v-model="cloud" @change="checkCloudSave">
                <span slot="label">
                  Save to Cloud
                  <v-tooltip top>
                    <v-icon small slot="activator" color="grey" class="mb-1">
                      help
                    </v-icon>
                    <span>
                      This custom frame image will be stored in the cloud, and the
                      <br />
                      image URL will be appended to its configuration's COMP/CON data.
                      <br />
                      When exporting this configuration, other users will see this
                      <br />
                      image, provided they are connected to the internet.
                    </span>
                  </v-tooltip>
                </span>
              </v-switch>
            </v-col>
          </v-row>
          <v-divider />
          <v-row justify="center" wrap fill-height align-center>
            <v-col v-if="config.CloudPortrait" cols="3">
              <div :class="`justify="center" pa-1 cloud`">
                <v-img
                  :src="config.CloudPortrait"
                  position="top"
                  max-height="40vh"
                  max-width="40vw"
                  contain
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
            </v-col>
            <v-col cols="3">
              <div class="clickable" @click="assignDefault">
                <v-img
                  :src="`file://${userDataPath}/img/default_frame/${config.Frame.ID}.png`"
                  position="top"
                  max-height="40vh"
                  max-width="40vw"
                  contain
                />
              </div>
            </v-col>
            <v-col v-for="i in images" :key="i" cols="3">
              <div
                :class="
                  `text-xs-right justify="center" pa-1 ${
                    i === config.LocalPortrait ? 'preselected' : 'clickable'
                  }`
                "
                @click="assignImage(i)"
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
                  :src="`file://${userDataPath}/img/frame/${i}`"
                  position="top"
                  max-height="40vh"
                  max-width="40vw"
                  contain
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import io from '@/features/_shared/data_io'
import apis from '@/io/apis'

export default Vue.extend({
  name: 'image-selector',
  props: {
    model: Boolean,
    config: Object,
  },
  data: () => ({
    display: false,
    images: [],
    cloud: false,
  }),
  methods: {
    assignDefault() {
      this.config.SetLocalPortrait('')
      this.config.SetCloudPortrait('')
      this.$emit('notify', 'Mech Image Saved')
      this.$emit('close')
    },
    assignImage(src: string) {
      if (this.cloud) this.cloudSave(src)
      else this.config.SetLocalPortrait(src)
      this.$emit('notify', 'Mech Image Saved')
      this.$emit('close')
    },
    deleteImage(src: string) {
      if (src === this.config.LocalPortrait) {
        this.config.SetLocalPortrait('')
      }
      io.deleteImage('frame', this.userDataPath, src)
      this.importAll()
      this.$forceUpdate()
    },
    importAll() {
      var vm = this as any
      vm.images = io.getImages('frame', vm.userDataPath).sort(function(a, b) {
        return a === vm.preselect ? 0 : 1
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
        if (this.config.LocalPortrait) this.cloudSave(this.config.LocalPortrait)
      } else {
        this.config.SetCloudPortrait('')
      }
    },
    cloudSave(src: string) {
      var vm = this as any
      apis
        .uploadImage(vm.userDataPath, 'frame', src)
        .then(function(json: any) {
          vm.config.SetCloudPortrait(json.data.link)
          vm.$emit('notify', 'Cloud Upload Successful')
        })
        .catch(function(err: any) {
          vm.emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
        })
    },
    close() {
      this.$emit('close')
    },
  },
  watch: {
    model (val) {
      if (val) {
        this.display = true
      } else {
        if (this.display) {
          this.display = false
        }
      }
    },
    display (val) {
      if (!val) this.close()
    }
  },
  mounted() {
    this.importAll()
  },
  created() {
    if (this.config.CloudPortrait) this.cloud = true
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
