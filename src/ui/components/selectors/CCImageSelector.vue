<template>
  <div>
    <v-tabs v-model="imageSelectTab"
      density="compact"
      grow
      bg-color="primary">
      <v-tab>Cloud Account</v-tab>
      <v-tab>Remote Images</v-tab>
      <v-tab>COMP/CON Image Archive</v-tab>
    </v-tabs>
    <v-container>
      <v-row align="center">
        <v-col cols="12"
          md="6"
          style="min-height: 800px">
          <v-window v-model="imageSelectTab">
            <v-window-item>
              <cloud-archive @set-staged="setCloudImage($event)" />
            </v-window-item>
            <v-window-item>
              <remote-archive @set-staged="setRemoteImage($event)" />
            </v-window-item>
            <v-window-item>
              <library-archive :item="item"
                :type="type"
                @set-staged="setLibImage($event)" />
            </v-window-item>
          </v-window>
        </v-col>
        <v-col>
          <div class="text-center"
            style="position: relative">
            <v-card variant="outlined"
              color="primary">
              <cc-img :src="displayImage"
                contain
                max-width="500px"
                max-height="500px"
                class="ml-auto mr-auto" />

              <v-card v-if="avatar"
                id="avatar-inset"
                variant="outlined"
                color="primary">
                <cc-avatar v-if="item.PortraitController.Avatar"
                  :avatar="item.PortraitController.Avatar" />
                <div v-else
                  class="text-overline pt-2">
                  no avatar set
                  <br />
                  <div v-if="!item.PortraitController.CloudImage"
                    class="pt-4"
                    v-text="'Requires Image Selection'" />
                </div>
              </v-card>
            </v-card>
            <v-row justify="space-around"
              class="mt-2">
              <v-col cols="auto"
                class="text-left">
                <cc-button size="small"
                  color="error"
                  prepend-icon="mdi-cancel"
                  @click="clearImage()">
                  clear image
                </cc-button>
              </v-col>
              <v-col v-if="avatar"
                cols="auto">
                <div class="d-flex justify-end">
                  <cc-modal ref="crop_dialog"
                    icon="mdi-crop"
                    color="primary"
                    title="Set Avatar">
                    <template #activator="{ open }">
                      <cc-button size="small"
                        color="success"
                        prepend-icon="mdi-crop"
                        :disabled="!item.PortraitController.CloudImage"
                        @click="open">
                        Set Avatar
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <image-crop :src="displayImage"
                        :img-key="selectedImageKey"
                        @hide="close"
                        @confirm="setAvatar($event, close)" />
                    </template>
                  </cc-modal>
                </div>
                <div class="d-flex justify-center mt-1">
                  <cc-button size="x-small"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import ImageCrop from './components/_ImageCrop.vue';
import CloudArchive from './image_archives/cloudArchive.vue';
import LibraryArchive from './image_archives/libraryArchive.vue';
import RemoteArchive from './image_archives/remoteArchive.vue';
const distributor = import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || '';

defineOptions({ name: 'ImageSelector' })

const props = defineProps<{
  item: object
  type: string
  avatar?: boolean
}>()

const emit = defineEmits<{
  'close': []
}>()

const crop_dialog = ref<any>(null)

const selectedImage = ref(null as unknown as any)
const selectedImageKey = ref(null as unknown as any)
const imageSelectTab = ref(0)
const stagedImage = ref(null as unknown as any)
const imageUrl = ref('')
const cropWindow = ref(false)

const displayImage = computed(() => {
      if (selectedImage.value) {
        if (typeof selectedImage.value === 'string') return selectedImage.value;
        if (selectedImage.value.url) return selectedImage.value.url;
        return `${distributor}/${selectedImage.value.uri}`;
      }
      if (props.item.Portrait) return props.item.Portrait;
      else return 'https://via.placeholder.com/550';
    })
const selectedImageUrl = computed(() => {
      if (selectedImage.value) {
        if (typeof selectedImage.value === 'string') return selectedImage.value;
        return selectedImage.value.url;
      }
      return '';
    })

function isSelected(url) {
      return selectedImageUrl.value === url;
    }
function clearImage() {
      props.item.PortraitController.Clear();
      selectedImage.value = null;
      if (!props.avatar) close();
    }
function saveImage() {
      if (!selectedImage.value) return;
      let img;
      if (typeof selectedImage.value === 'string') img = selectedImage.value;
      else if (selectedImage.value.url) img = selectedImage.value.url;
      else img = `${distributor}/${selectedImage.value.uri}`;

      props.item.PortraitController.CloudImage = img;
      if (!props.avatar) close();
    }
function open() {}
function close() {
      emit('close');
    }
function clearCrop() {
      props.item.PortraitController.Avatar = undefined;
    }
function setAvatar(avatar, closeFn: Function) {
      props.item.PortraitController.Avatar = avatar;
      closeFn();
    }
function setLocalImage(img: any) {
      selectedImage.value = img;
      selectedImageKey.value = img.key;
      props.item.PortraitController.SetLocalImage(img.key);
    }
function setLibImage(img: any) {
      selectedImageKey.value = '';
      selectedImage.value = img;
      saveImage();
    }
function setRemoteImage(img: any) {
      selectedImageKey.value = '';
      selectedImage.value = img;
      saveImage();
    }
function setCloudImage(img: any) {
      selectedImageKey.value = `${distributor}/${img.uri}`;
      selectedImage.value = img;
      saveImage();
    }
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
