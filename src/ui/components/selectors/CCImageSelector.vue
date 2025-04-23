<template>
  <div>
    <v-tabs v-model="imageSelectTab" density="compact" grow bg-color="primary">
      <v-tab>Cloud Account</v-tab>
      <v-tab>Local Image Archive</v-tab>
      <v-tab>COMP/CON Image Archive</v-tab>
      <v-tab>Remote Images</v-tab>
    </v-tabs>
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6" style="min-height: 800px">
          <v-window v-model="imageSelectTab">
            <v-window-item>
              <cloud-archive @set-staged="setCloudImage($event)" />
            </v-window-item>
            <v-window-item>
              <local-archive @set-staged="setLocalImage($event)" />
            </v-window-item>
            <v-window-item>
              <library-archive :item="item" :type="type" @set-staged="setLibImage($event)" />
            </v-window-item>
            <v-window-item>
              <remote-archive @set-staged="setRemoteImage($event)" />
            </v-window-item>
          </v-window>
        </v-col>
        <v-col>
          <div class="text-center" style="position: relative">
            <v-card variant="outlined" color="primary">
              <cc-img
                :src="displayImage"
                contain
                max-width="500px"
                max-height="500px"
                class="ml-auto mr-auto" />

              <v-card v-if="avatar" id="avatar-inset" variant="outlined" color="primary">
                <cc-avatar
                  v-if="item.PortraitController.Avatar"
                  :avatar="item.PortraitController.Avatar" />
                <div v-else class="text-overline pt-2">
                  no avatar set
                  <br />
                  <div
                    v-if="!item.PortraitController.CloudImage"
                    v-text="'Requires Image Selection'"
                    class="pt-4" />
                </div>
              </v-card>
            </v-card>
            <v-row justify="space-around" class="mt-2">
              <v-col cols="auto" class="text-left">
                <cc-button
                  size="small"
                  color="error"
                  prepend-icon="mdi-cancel"
                  @click="clearImage()">
                  clear image
                </cc-button>
              </v-col>
              <v-col v-if="avatar" cols="auto">
                <div class="d-flex justify-end">
                  <cc-modal ref="crop_dialog" icon="mdi-crop" color="primary" title="Set Avatar">
                    <template #activator="{ open }">
                      <cc-button
                        size="small"
                        color="success"
                        prepend-icon="mdi-crop"
                        :disabled="!item.PortraitController.CloudImage"
                        @click="open">
                        Set Avatar
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <image-crop
                        :src="displayImage"
                        :img-key="selectedImageKey"
                        @hide="close"
                        @confirm="setAvatar($event, close)" />
                    </template>
                  </cc-modal>
                </div>
                <div class="d-flex justify-center mt-1">
                  <cc-button
                    size="x-small"
                    color="stark"
                    prepend-icon="mdi-cancel"
                    class="fade-select"
                    variant="outlined"
                    @click="clearCrop()">
                    clear avatar
                  </cc-button>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import ImageCrop from './components/_ImageCrop.vue';
import CloudArchive from './image_archives/cloudArchive.vue';
import LocalArchive from './image_archives/localArchive.vue';
import LibraryArchive from './image_archives/libraryArchive.vue';
import RemoteArchive from './image_archives/remoteArchive.vue';

const distributor = import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR;

export default {
  name: 'image-selector',
  components: { ImageCrop, CloudArchive, LocalArchive, LibraryArchive, RemoteArchive },
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    avatar: {
      type: Boolean,
    },
  },
  data: () => ({
    selectedImage: null as unknown as any,
    selectedImageKey: null as unknown as any,
    imageSelectTab: 0,
    stagedImage: null as unknown as any,
    imageUrl: '',
    cropWindow: false,
  }),
  computed: {
    displayImage() {
      if (this.selectedImage) {
        if (typeof this.selectedImage === 'string') return this.selectedImage;
        if (this.selectedImage.url) return this.selectedImage.url;
        return `${distributor}/${this.selectedImage.uri}`;
      }
      if (this.item.Portrait) return this.item.Portrait;
      else return 'https://via.placeholder.com/550';
    },
    selectedImageUrl() {
      if (this.selectedImage) {
        if (typeof this.selectedImage === 'string') return this.selectedImage;
        return this.selectedImage.url;
      }
      return '';
    },
  },
  methods: {
    isSelected(url) {
      return this.selectedImageUrl === url;
    },
    clearImage() {
      this.item.PortraitController.Clear();
      this.selectedImage = null;
      if (!this.avatar) this.close();
    },
    saveImage() {
      if (!this.selectedImage) return;
      let img;
      if (typeof this.selectedImage === 'string') img = this.selectedImage;
      else if (this.selectedImage.url) img = this.selectedImage.url;
      else img = `${distributor}/${this.selectedImage.uri}`;

      this.item.PortraitController.CloudImage = img;
      if (!this.avatar) this.close();
    },
    open() {
      (this.$refs as any).dialog.show();
    },
    close() {
      (this.$refs as any).dialog.hide();
    },
    clearCrop() {
      this.item.PortraitController.Avatar = undefined;
    },
    setAvatar(avatar, closeFn: Function) {
      this.item.PortraitController.Avatar = avatar;
      closeFn();
    },
    setLocalImage(img: any) {
      this.selectedImage = img;
      this.selectedImageKey = img.key;
      console.log(img.key);
      this.item.PortraitController.SetLocalImage(img.key);
    },
    setLibImage(img: any) {
      this.selectedImageKey = '';
      this.selectedImage = img;
      this.saveImage();
    },
    setRemoteImage(img: any) {
      this.selectedImageKey = '';
      this.selectedImage = img;
      this.saveImage();
    },
    setCloudImage(img: any) {
      this.selectedImageKey = `${distributor}/${img.uri}`;
      this.selectedImage = img;
      this.saveImage();
    },
  },
};
</script>

<style scoped>
#avatar-inset {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background-color: rgb(var(--v-theme-panel));
  opacity: 0.9;
  transition: opacity 0.3s ease-in-out;
}

#avatar-inset:hover {
  opacity: 1;
}
</style>
