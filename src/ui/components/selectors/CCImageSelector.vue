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
            <v-tab>Cloud Account</v-tab>
            <v-tab>COMP/CON Image Archive</v-tab>
          </v-tabs>
          <v-window v-model="imageSelectTab">
            <v-window-item>
              <v-card>
                <v-alert
                  v-if="!isAuthed"
                  color="subtle"
                  variant="outlined"
                  class="ma-2"
                  icon="mdi-cloud-alert"
                >
                  Requires COMP/CON Account
                </v-alert>
                <div v-else>
                  <v-row dense align="center">
                    <v-col v-for="image in displayedUserImages" :key="image.url" cols="4" md="3">
                      <v-card
                        class="ma-2"
                        outlined
                        tile
                        :color="isSelected(image.url) ? 'primary' : ''"
                        :class="{ selected: image === selectedImage }"
                        style="border-width: 3px"
                        @click="
                          isSelected(image.url) ? (selectedImage = null) : (selectedImage = image)
                        "
                      >
                        <div class="background">
                          <v-img :src="image.url" contain max-height="200px" />
                        </div>
                      </v-card>
                      <v-scale-transition>
                        <v-card v-if="isSelected(image.url)" flat outlined class="pa-1" tile>
                          <div class="caption pb-1">
                            {{ image.filename }} &mdash; {{ image.size.toFixed(2) }}MB
                            <span v-if="showAll">&mdash; {{ image.tag }}</span>
                          </div>
                          <v-menu offset-y offset-x top left>
                            <template v-slot:activator="{ on }">
                              <v-btn block outlined color="error" x-small v-on="on">Delete</v-btn>
                            </template>
                            <cc-confirmation
                              content="This will permanently delete this image from storage.</span> Do you want to continue?"
                              @confirm="deleteCloudImage(image)"
                            />
                          </v-menu>
                        </v-card>
                      </v-scale-transition>
                    </v-col>
                  </v-row>
                  <v-pagination
                    v-model="currentUserPage"
                    :length="totalUserPages"
                    total-visible="9"
                    @input="currentUserPage = $event"
                  />
                  <v-divider class="my-3" />
                  <v-card-text>
                    <div class="heading h3 ml-n2">UPLOAD IMAGE</div>
                    <v-row align="center">
                      <v-col>
                        <v-file-input
                          v-model="stagedImage"
                          dense
                          hide-details
                          outlined
                          label="Add New Image"
                          accept="image/*"
                          class="mt-1 mb-2"
                          :disabled="loading || isOverCapacity || !isAuthed"
                          @change="setStagedImage"
                        />
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          color="secondary"
                          :disabled="!stagedImage || isOverCapacity || !isAuthed"
                          :loading="loading"
                          @click="uploadImage()"
                        >
                          Upload
                        </v-btn>
                      </v-col>
                    </v-row>
                    <div>
                      <div class="text-caption">
                        ACCOUNT USAGE
                        <cc-tooltip
                          inline
                          :content="`Free accounts are restricted to ${accountMax}MB of storage. In an upcoming release you will be able to link your Patreon account, and COMP/CON supporters will not be subject to any storage limits.`"
                        >
                          <v-icon small>mdi-information-outline</v-icon>
                        </cc-tooltip>
                      </div>

                      <v-progress-linear :value="(accountUsage / accountMax) * 100" height="20px">
                        <template v-slot:default="{ value }">
                          <strong>
                            {{ accountUsage.toFixed(2) }}
                            <span class="text-caption">MB</span>
                            &nbsp;/&nbsp;{{ accountMax.toFixed(2) }}
                            <span class="text-caption">MB</span>
                            ({{ (accountUsage / accountMax).toFixed(2) }}%)
                          </strong>
                        </template>
                      </v-progress-linear>
                    </div>
                    <v-alert
                      v-show="isOverCapacity"
                      color="error"
                      prominent
                      outlined
                      tile
                      icon="mdi-alert"
                    >
                      <div class="heading h3">CAPACITY EXCEEDED</div>
                      <span>
                        Your account is over capacity. Free accounts are restricted to
                        {{ accountMax }}MB of storage.
                      </span>
                      <span>
                        In an upcoming release you will be able to link your Patreon account, and
                        COMP/CON supporters will not be subject to any storage limits.
                      </span>
                    </v-alert>
                  </v-card-text>
                </div>
              </v-card>
            </v-window-item>
            <v-window-item>
              <v-row class="my-1">
                <v-col>
                  <v-select
                    label="Image Type"
                    v-model="selectedTags"
                    hide-details
                    density="compact"
                    variant="outlined"
                    :items="imageTags"
                    multiple
                    chips
                  />
                </v-col>
              </v-row>
              <v-card>
                <v-row dense align="center">
                  <v-col v-for="image in displayedArtistImages" :key="image.url" cols="4" md="3">
                    <v-card
                      class="ma-2"
                      outlined
                      tile
                      :color="isSelected(image.url) ? 'primary' : ''"
                      :class="{ selected: image === selectedImage }"
                      style="border-width: 3px"
                      @click="
                        isSelected(image.url) ? (selectedImage = null) : (selectedImage = image)
                      "
                    >
                      <div class="background">
                        <v-img :src="image.url" contain max-height="200px" />
                      </div>
                    </v-card>
                    <v-scale-transition>
                      <v-card v-if="isSelected(image.url)" flat outlined class="pa-1" tile>
                        <div class="text-caption text-center">
                          Artwork by
                          <b>{{ image.artist }}</b>
                        </div>
                        <div class="text-center mt-n2">
                          <v-btn
                            v-if="image.website"
                            size="small"
                            icon
                            variant="plain"
                            :href="image.website"
                            target="_blank"
                            class="mx-2"
                          >
                            <v-icon>mdi-web</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="image.twitter"
                            size="small"
                            icon
                            variant="plain"
                            :href="`https://twitter.com/${image.twitter}`"
                            target="_blank"
                            class="mx-2"
                          >
                            <v-icon>mdi-twitter</v-icon>
                          </v-btn>
                        </div>
                      </v-card>
                    </v-scale-transition>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="currentArtistPage"
                  :length="totalArtistPages"
                  total-visible="9"
                  @input="currentArtistPage = $event"
                />
              </v-card>
            </v-window-item>
          </v-window>

          <v-divider class="ma-6" />

          <div class="heading h3">
            USE REMOTE IMAGE
            <cc-tooltip
              inline
              content="Link a remotely-hosted image to this asset. These images are not stored or managed by COMP/CON and are subject to change or removal based on their hosts."
            >
              <v-icon left>mdi-information-outline</v-icon>
            </cc-tooltip>
          </div>
          <v-row align="center">
            <v-col>
              <v-text-field
                v-model="remoteInput"
                class="px-6 mt-2"
                dense
                outlined
                hide-details
                placeholder="Link Image"
                prepend-icon="mdi-image-sync"
                :disabled="loading"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="secondary"
                :disabled="!remoteInput || remoteError.length > 0"
                @click="setRemoteImage()"
              >
                Load
              </v-btn>
            </v-col>
          </v-row>
          <v-alert v-if="remoteError" type="error" class="mt-3">
            <v-row>
              <v-col>{{ remoteError }}</v-col>
              <v-col cols="auto">
                <v-btn icon @click="remoteError = ''"><v-icon>mdi-close</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-alert>
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
                <v-btn
                  color="secondary"
                  :disabled="(!remoteInput || remoteError.length > 0) && !selectedImageUrl"
                  @click="saveImage()"
                >
                  Set Image
                </v-btn>
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
                    :src="selectedImageUrl"
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
// import { UserStore } from '@/store';
import _ from 'lodash';
import ImageCrop from './components/_ImageCrop.vue';
import { storageInfo, getPresignedLink, s3api, deleteStorage } from '@/user/api';
import { Auth } from '@aws-amplify/auth';
import artistmap from '@/assets/artistmap.json';

export default {
  name: 'web-image-selector',
  components: { ImageCrop },
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
    currentUserPage: 1,
    currentArtistPage: 1,
    itemsPerPage: 12,
    selectedImage: null as unknown as any,
    loading: false,
    imageSelectTab: 0,
    remoteInput: '',
    remoteError: '',
    accountUsage: 0,
    accountMax: 250,
    iid: '',
    userStorageData: null as unknown as any,
    stagedImage: null as unknown as any,
    showAll: false,
    imageUrl: '',
    selectedTags: [] as string[],
    cropWindow: false,
  }),
  async mounted() {
    this.selectedTags = [this.type];
    if (!this.iid) await this.getStorageInfo();
  },
  computed: {
    displayedUserImages() {
      const startIndex = (this.currentUserPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.userImages.slice(startIndex, endIndex);
    },
    totalUserPages() {
      return Math.ceil(this.userImages.length / this.itemsPerPage);
    },
    displayedArtistImages() {
      const startIndex = (this.currentArtistPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.artistImages.slice(startIndex, endIndex);
    },
    totalArtistPages() {
      return Math.ceil(this.artistImages.length / this.itemsPerPage);
    },
    displayImage() {
      if (this.selectedImage) return this.selectedImage.url;
      if (this.item.Portrait) return this.item.Portrait;
      else return 'https://via.placeholder.com/550';
    },
    isAuthed() {
      return false;
      // TODO
      // return getModule(UserStore, this.$store).IsLoggedIn;
    },
    isOverCapacity() {
      return (
        this.isAuthed &&
        this.userStorageData &&
        this.userStorageData.totalSize >= this.userStorageData.max
      );
    },
    userImages() {
      if (!this.userStorageData || this.userStorageData.contents.length === 0) return [];
      const contents = this.userStorageData.contents
        .flatMap((x) => x.objects)
        .map((x) => ({
          url: `https://d1nurxym97qk9o.cloudfront.net/${x.Key}`,
          filename: x.Key.split('/').pop(),
          tag: x.Key.split('/').slice(-2, -1)[0],
          size: x.Size / 1000000,
          key: x.Key,
        }));
      return contents;
    },
    imageTags() {
      return _.uniq([...artistmap.flatMap((x) => Object.keys(x.images))]);
    },
    artistImages() {
      let out = [] as any[];

      artistmap.forEach((artist) => {
        this.selectedTags.forEach((t) => {
          if (artist.images[t])
            artist.images[t].forEach((image) => {
              out.push({
                url: image.img,
                filename: image.name,
                tag: this.type,
                artist: artist.artist,
                website: artist.website || '',
                twitter: artist.twitter || '',
              });
            });
        });
      });
      return out;
    },
    selectedImageUrl() {
      return this.selectedImage ? this.selectedImage.url : '';
    },
  },
  methods: {
    async getStorageInfo() {
      if (this.isAuthed) {
        const res = await Auth.currentUserCredentials();
        this.iid = res.identityId;
        const info = await storageInfo(this.iid);
        this.userStorageData = info.data;
        if (this.userStorageData) {
          this.accountUsage = info.data.totalSize / 1000000;
          this.accountMax = info.data.max / 1000000;
        }
      }
    },
    isSelected(url) {
      return this.selectedImageUrl === url;
    },
    clearImage() {
      this.item.PortraitController.SetCloudImage('');
      this.selectedImage = null;
    },
    saveImage() {
      this.item.PortraitController.Avatar = undefined;
      this.item.PortraitController.CloudImage =
        typeof this.selectedImage === 'string' ? this.selectedImage : this.selectedImage.url;
      this.loading = false;
    },
    setRemoteImage() {
      if (!this.remoteInput) return;
      if (!this.validURL(this.remoteInput)) {
        this.remoteError = 'Invalid URL';
        return;
      }

      const http = new XMLHttpRequest();

      http.open('GET', this.remoteInput, false);
      http.send();

      if (http.status === 404) {
        this.remoteError = 'Image not found';
        return;
      }

      this.remoteError = '';
      this.selectedImage = this.remoteInput;
    },
    setStagedImage() {
      if (!this.stagedImage) return;
      this.selectedImage = null;
      this.imageUrl = URL.createObjectURL(this.stagedImage);
    },
    uploadImage() {
      if (!this.stagedImage) return;
      this.loading = true;

      getPresignedLink(this.iid, 'image', this.type, this.stagedImage.name)
        .then((res) => {
          const sUrl = res.data;

          const reader = new FileReader();
          reader.onloadend = () => {
            s3api
              .put(sUrl, reader.result)
              .then(() => {
                this.loading = false;
              })
              .then(() => {
                this.stagedImage = null;
                this.getStorageInfo();
              })
              .catch((err) => {
                this.loading = false;
                console.error(err);
              });
          };

          reader.readAsArrayBuffer(this.stagedImage);
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
        });
    },
    async deleteCloudImage(image) {
      deleteStorage(image.key).then(() => {
        this.selectedImage = null;
        this.getStorageInfo();
      });
    },
    // Pulled from Stackoverflow: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    validURL(str: string): boolean {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      return !!pattern.test(str);
    },
    open() {
      (this.$refs as any).dialog.show();
      if (!this.iid) this.getStorageInfo();
    },
    close() {
      (this.$refs as any).dialog.hide();
    },
    clearCrop() {
      this.item.PortraitController.Avatar = undefined;
    },
    setAvatar(avatar) {
      console.log(avatar);
      this.item.PortraitController.Avatar = avatar;
      (this.$refs.crop_dialog as any).hide();
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
