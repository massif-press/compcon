<template>
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
        closable-chips />
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
          @click="isSelected(image.url) ? (selectedImage = null) : stage(image)">
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
                class="mx-2">
                <v-icon>mdi-web</v-icon>
              </v-btn>
              <v-btn
                v-if="image.twitter"
                size="small"
                icon
                variant="plain"
                :href="`https://twitter.com/${image.twitter}`"
                target="_blank"
                class="mx-2">
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
      @input="currentArtistPage = $event" />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import artistMap from '@/assets/artistmap.json';

export default {
  name: 'library-image-archive',
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
    userStorageData: null as unknown as any,
    stagedImage: null as unknown as any,
    imageUrl: '',
    selectedTags: [] as string[],
  }),
  emits: ['set-staged'],
  async created() {
    this.selectedTags = [this.type];
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
      return _.uniq([...artistMap.flatMap((x) => Object.keys(x.images))]);
    },
    artistImages() {
      let out = [] as any[];

      artistMap.forEach((artist) => {
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
    isSelected(url) {
      return this.selectedImageUrl === url;
    },
    stage(image) {
      this.selectedImage = image;
      this.$emit('set-staged', image);
    },
  },
};
</script>
