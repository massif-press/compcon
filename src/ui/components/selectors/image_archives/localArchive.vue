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
          @click="selectedImage === image.url ? (selectedImage = null) : stage(image)"
        >
          <div class="background">
            <v-img :src="image.url" contain max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card
            v-if="selectedImage === image.url"
            flat
            color="subtle"
            variant="outlined"
            class="pa-1"
            tile
          >
            <div class="text-caption pb-1 text-center">
              {{ image.key }}
            </div>
            <v-menu offset-y offset-x top left>
              <template v-slot:activator="{ props }">
                <v-btn block variant="outlined" color="error" size="x-small" v-bind="props"
                  >Delete</v-btn
                >
              </template>
              <cc-confirmation
                content="This will permanently delete this image from storage.</span> Do you want to continue?"
                @confirm="deleteLocalImage(image.key)"
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
            @change="$emit('set-staged', $event)"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn color="secondary" :loading="loading" @click="uploadImage()"> Upload </v-btn>
        </v-col>
      </v-row>
      <div>
        <div class="text-caption">
          STORAGE USAGE
          <cc-tooltip
            inline
            :content="`This represents the total amount of local disk spaced used by COMP/CON. This includes all images, data files, and other assets.`"
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import { GetKeys, RemoveItem, AddBlob, GetBlob } from '@/io/Storage';

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
  async mounted() {
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

      const blob = new Blob(this.stagedImage, { type: 'image/jpeg' });
      AddBlob('images', this.stagedImage[0].name, blob)
        .then(() => this.getUserImages())
        .catch((e) => console.error(e))
        .finally(() => (this.loading = false));
    },
    async deleteLocalImage(key) {
      RemoveItem('images', key);
    },
    stage(image) {
      this.selectedImage = image.url;
      this.$emit('set-staged', image);
    },
  },
  unmounted() {
    this.urls.forEach((url) => URL.revokeObjectURL(url));
  },
};
</script>
