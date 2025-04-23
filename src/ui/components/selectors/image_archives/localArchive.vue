<template>
  <v-card>
    <v-row dense align="center">
      <v-col v-for="image in displayedUserImages" cols="4" md="3">
        <v-card
          class="ma-2"
          outlined
          tile
          :color="selectedImage === image.url ? 'primary' : ''"
          :class="{ selected: image === selectedImage }"
          style="border-width: 3px"
          @click="selectedImage === image.url ? (selectedImage = null) : stage(image)">
          <div class="background">
            <v-img :src="image.url" contain max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card v-if="selectedImage === image.url" flat class="pa-1" tile>
            <div class="text-caption pb-1 text-center">
              {{ image.key }}
            </div>
            <v-menu offset-y offset-x top left>
              <template v-slot:activator="{ props }">
                <v-btn block variant="tonal" color="error" size="x-small" v-bind="props">
                  Delete
                </v-btn>
              </template>
              <cc-confirmation
                content="This will permanently delete this image from storage.</span> Do you want to continue?"
                @confirm="deleteLocalImage(image.key)" />
            </v-menu>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
    <v-pagination
      v-model="currentUserPage"
      :length="totalUserPages"
      total-visible="9"
      @input="currentUserPage = $event" />
    <v-divider class="my-3" />
    <cc-alert
      density="compact"
      class="my-2 text-caption"
      icon="mdi-alert"
      title="Local Data Warning">
      Images in this gallery are saved as local app data and will count towards the app storage
      limit set by your browser, not your cloud account.
      <br />
      <div class="text-center font-weight-bold">This may not work on all browsers or devices.</div>
      <br />
      Furthermore, this data will not be shared or transferred along with pilots and resides only on
      this device. To share artwork or other image data with other users, please use COMP/CON cloud
      storage.
    </cc-alert>
    <v-card-text>
      <div class="heading h3 ml-n2">UPLOAD IMAGE</div>
      <v-row align="center">
        <v-col>
          <v-file-input
            v-model="stagedImage"
            density="compact"
            hide-details
            flat
            tile
            label="Add New Image"
            accept="image/*"
            class="mt-1 mb-2"
            @change="$emit('set-staged', $event)" />
        </v-col>
        <v-col cols="auto">
          <cc-button color="accent" :loading="loading" @click="uploadImage()">Upload</cc-button>
        </v-col>
      </v-row>
      <div>
        <div class="text-caption">
          BROWSER STORAGE USAGE
          <v-tooltip
            inline
            :text="`This represents the total amount of local disk spaced used by COMP/CON. This includes all images, data files, and other assets.`"
            max-width="300px">
            <template #activator="{ props }">
              <v-icon small v-bind="props">mdi-information-box-outline</v-icon>
            </template>
          </v-tooltip>
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import { GetKeys, RemoveItem, AddBlob, GetBlob } from '@/io/Storage';
import logger from '@/user/logger';

export default {
  name: 'cloud-image-archive',
  data: () => ({
    currentUserPage: 1,
    currentArtistPage: 1,
    itemsPerPage: 12,
    selectedImage: null as unknown as any,
    loading: false,
    accountUsage: 0,
    accountMax: 250,
    userStorageData: null as unknown as any,
    stagedImage: null as unknown as any,
    userImages: [],
    urls: [] as string[],
  }),
  emits: ['set-staged'],
  async created() {
    await this.getStorageInfo();
    await this.getUserImages();
  },
  computed: {
    displayedUserImages() {
      const images = this.userImages.map((key, index) => ({
        key,
        url: this.urls[index],
      }));
      const startIndex = (this.currentUserPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return images.slice(startIndex, endIndex);
    },
    totalUserPages() {
      return Math.ceil(this.userImages.length / this.itemsPerPage);
    },
  },
  methods: {
    async getUserImages() {
      this.userImages = await GetKeys('images');
      const blobs = await Promise.all(this.userImages.map((key) => GetBlob('images', key)));
      this.urls = blobs.map((blob) => URL.createObjectURL(blob));
    },
    async dataUrl(key) {
      const url = URL.createObjectURL(await GetBlob('images', key));
      this.urls.push(url);
      return url;
    },
    async getStorageInfo() {
      const est = await navigator.storage.estimate();

      if (est) {
        this.accountUsage = est.usage ? est.usage / 1000000 : 0;
        this.accountMax = est.quota ? est.quota / 1000000 : 0;
      }
    },
    async uploadImage() {
      if (!this.stagedImage) return;
      this.loading = true;

      const blob = new Blob([this.stagedImage], { type: this.stagedImage.type });
      AddBlob('images', this.stagedImage.name, blob)
        .then.then(() => this.getUserImages())
        .catch((e) => logger.error(`Error uploading image: ${e}`, this))
        .finally(() => (this.loading = false));
    },
    async deleteLocalImage(key) {
      RemoveItem('images', key);
    },
    stage(image) {
      console.log(image);
      this.selectedImage = image.url;
      this.$emit('set-staged', image);
    },
  },
  unmounted() {
    this.urls.forEach((url) => URL.revokeObjectURL(url));
  },
};
</script>
