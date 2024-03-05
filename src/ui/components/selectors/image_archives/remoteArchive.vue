<template>
  <v-card>
    <v-row dense align="center">
      <v-col v-for="image in displayedRemoteImages" cols="4" md="3">
        <v-card
          class="ma-2"
          outlined
          tile
          :color="selectedImage === image ? 'primary' : ''"
          :class="{ selected: image === selectedImage }"
          style="border-width: 3px"
          @click="selectedImage === image ? (selectedImage = null) : stage(image)">
          <div class="background">
            <v-img :src="image" contain max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card
            v-if="selectedImage === image"
            flat
            color="subtle"
            variant="outlined"
            class="pa-1"
            tile>
            <div class="text-caption pb-1 text-center">
              {{ image }}
            </div>
            <v-menu offset-y offset-x top left>
              <template v-slot:activator="{ props }">
                <v-btn block variant="outlined" color="error" size="x-small" v-bind="props"
                  >Delete</v-btn
                >
              </template>
              <cc-confirmation
                content="This will delete this image link from your library.</span> Do you want to continue?"
                @confirm="deleteRemoteImage(image)" />
            </v-menu>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
    <v-pagination
      v-model="currentRemotePage"
      :length="totalRemotePages"
      total-visible="9"
      @input="currentRemotePage = $event" />
    <v-divider class="my-3" />
    <v-alert
      density="compact"
      class="my-2 text-caption"
      prominent
      icon="mdi-alert"
      style="opacity: 0.5"
      ><i
        >Images in this gallery are links to remote resources and are not managed by COMP/CON. If
        you do not control the remote host, items may be removed or changed at any time.
      </i></v-alert
    >

    <v-card-text>
      <div class="heading h3">
        ADD REMOTE IMAGE
        <cc-tooltip
          inline
          content="Link a remotely-hosted image to this asset. These images are not stored or managed by COMP/CON and are subject to change or removal based on their hosts.">
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
            :disabled="loading" />
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="secondary"
            :disabled="!remoteInput || remoteError.length > 0"
            @click="setRemoteImage()">
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
import { SetItem, RemoveItem, GetKeys } from '@/io/Storage';

export default {
  name: 'remote-image-archive',
  data: () => ({
    currentRemotePage: 1,
    itemsPerPage: 12,
    selectedImage: null as unknown as any,
    loading: false,
    imageSelectTab: 0,
    remoteInput: '',
    remoteError: '',
    iid: '',
    stagedImage: null as unknown as any,
    showAll: false,
    imageUrl: '',
    remoteImages: [] as string[],
    urls: [] as string[],
  }),
  emits: ['set-staged'],
  async mounted() {
    await this.getRemoteImages();
  },
  computed: {
    displayedRemoteImages() {
      const startIndex = (this.currentRemotePage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.remoteImages.slice(startIndex, endIndex);
    },
    totalRemotePages() {
      return Math.ceil(this.remoteImages.length / this.itemsPerPage);
    },
  },
  methods: {
    async getRemoteImages() {
      this.remoteImages = await GetKeys('remote_images');
    },
    async deleteRemoteImage(key) {
      RemoveItem('remote_images', key);
      await this.getRemoteImages();
    },
    stage(image) {
      this.selectedImage = image;
      this.$emit('set-staged', image);
    },
    async setRemoteImage() {
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
      await SetItem('remote_images', this.remoteInput);
      await this.getRemoteImages();
      this.currentRemotePage = this.totalRemotePages;
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
