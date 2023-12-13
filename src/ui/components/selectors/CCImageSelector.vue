<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    fullscreen
    closeable
    no-confirm
    icon="mdi-image"
    title="Select Image"
  >
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6" style="min-height: 800px">
          <v-tabs v-model="imageSelectTab">
            <v-tab>Local Image Archive</v-tab>
            <v-tab>Cloud Account</v-tab>
            <v-tab>COMP/CON Image Archive</v-tab>
            <v-tab>Remote Images</v-tab>
          </v-tabs>
          <v-window v-model="imageSelectTab">
            <v-window-item>
              <local-archive @set-staged="setLocalImage($event)" />
            </v-window-item>
            <v-window-item>
              <cloud-archive @set-staged="stagedImage = $event" />
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
            <v-img
              :src="displayImage"
              contain
              max-width="500px"
              max-height="500px"
              class="ml-auto mr-auto"
            >
              <v-card v-if="avatar" id="avatar-inset" variant="outlined" color="primary">
                <cc-avatar
                  v-if="item.PortraitController.Avatar"
                  :avatar="item.PortraitController.Avatar"
                />
                <div v-else class="text-overline pt-2">
                  no avatar set<br />
                  <div
                    v-if="!item.PortraitController.CloudImage"
                    v-text="'Requires Image Selection'"
                    class="pt-4"
                  />
                </div>
              </v-card>
            </v-img>
            <v-row justify="space-around" class="mt-2">
              <v-col cols="auto" class="text-left">
                <v-btn color="secondary" @click="saveImage()"> Set Image </v-btn>
                <br />
                <v-btn size="small" class="mt-2" variant="outlined" @click="clearImage()"
                  >clear image</v-btn
                >
              </v-col>
              <v-col v-if="avatar" cols="auto" class="text-right">
                <v-btn
                  color="secondary"
                  :disabled="!item.PortraitController.CloudImage"
                  @click="($refs.crop_dialog as any).show()"
                >
                  Set Avatar
                </v-btn>
                <cc-solo-dialog
                  ref="crop_dialog"
                  icon="mdi-crop"
                  color="primary"
                  large
                  title="Set Avatar"
                  no-actions
                >
                  <image-crop
                    :src="displayImage"
                    :img-key="selectedImageKey"
                    @hide="($refs.crop_dialog as any).hide()"
                    @confirm="setAvatar($event)"
                  />
                </cc-solo-dialog>
                <br />
                <v-btn size="small" class="mt-2" variant="outlined" @click="clearCrop()"
                  >clear avatar</v-btn
                >
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import _ from 'lodash';
import ImageCrop from './components/_ImageCrop.vue';
import CloudArchive from './image_archives/cloudArchive.vue';
import LocalArchive from './image_archives/localArchive.vue';
import LibraryArchive from './image_archives/libraryArchive.vue';
import RemoteArchive from './image_archives/remoteArchive.vue';

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
        return this.selectedImage.url;
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
      this.item.PortraitController.SetCloudImage('');
      this.selectedImage = null;
      if (!this.avatar) this.close();
    },
    saveImage() {
      this.item.PortraitController.CloudImage =
        typeof this.selectedImage === 'string' ? this.selectedImage : this.selectedImage.key;
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
    setAvatar(avatar) {
      this.item.PortraitController.Avatar = avatar;
      (this.$refs.crop_dialog as any).hide();
    },
    setLocalImage(img: any) {
      this.selectedImage = img;
      this.selectedImageKey = img.key;
    },
    setLibImage(img: any) {
      this.selectedImageKey = '';
      this.selectedImage = img;
    },
    setRemoteImage(img: any) {
      this.selectedImageKey = '';
      this.selectedImage = img;
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
