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
      <div class="heading h3">
        ADD REMOTE IMAGE
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import { GetKeys, RemoveItem, AddBlob, GetBlob } from '@/io/Storage';

export default {
  name: 'remote-image-archive',
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
  },
};
</script>
